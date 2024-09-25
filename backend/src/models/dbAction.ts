import { PrismaClient } from "@prisma/client";

interface Result {
    rollNo: string;
    name: string;
    cgpa: string;
    resultDes: string;
}

const prisma = new PrismaClient();

export async function createList(list: Array<string>): Promise<{ success?: string; error?: string }> {
    try {
        for (const rollNo of list) {
            await prisma.enrollmentNo.upsert({
                where: { rollNo },
                update: {},
                create: { rollNo }
            })
        }

        // console.log("entries created successfully!!");
        return { success: "entries done!" };

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error("Unknown error occurred");
        }
        return { error: "Error in creating entries" };
    } finally {
        await prisma.$disconnect();
    }
}

export async function next(): Promise<{ rollNo: string } | { error: string }> {
    const maxRetries = 16;
    let attempts = 0;

    while (attempts < maxRetries) {
        try {
            const result = await prisma.$transaction(async (tx) => {
                const enrollmentNo = await tx.enrollmentNo.findFirst({
                    where: {
                        success: false,
                        picked: false,
                        notFound: false
                    },
                    select: {
                        rollNo: true
                    }
                });

                if (!enrollmentNo) {
                    return { error: "No enrollmentNo found" };
                }

                const updated = await tx.enrollmentNo.updateMany({
                    where: {
                        rollNo: enrollmentNo.rollNo,
                        picked: false
                    },
                    data: {
                        picked: true
                    }
                });

                if (updated.count === 0) {
                    throw new Error("Race condition: record was already picked");
                }

                return enrollmentNo;
            });

            return result;

        } catch (err: any) {
            console.error(`Attempt ${attempts + 1} failed: ${err.message}`);
            attempts++;

            await new Promise(res => setTimeout(res, 1000));
        }
    }

    return { error: "Failed to fetch next enrollment number after multiple attempts" };
};

export async function addResult(result: Result): Promise<{ success?: any; error?: any }> {
    try {
        const response = await prisma.result.create({
            data: {
                rollNo: result.rollNo,
                name: result.name,
                cgpa: result.cgpa,
                resultDes: result.resultDes,
            },
        });
        if (!response) {
            return { error: "No response from the database" };
        }
        return { success: response };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return { error: err.message };
        }
        console.error("Unknown error occurred");
        return { error: "Unknown error occurred" };
    }
}

export async function togglePicked(enrollmentNum: string): Promise<{ success?: any; error?: any }> {
    try {
        const response = await prisma.enrollmentNo.update({
            where: {
                rollNo: enrollmentNum,
            },
            data: {
                picked: false
            }
        });
        if (!response) {
            return { error: "No response from the database" };
        }
        return { success: response };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return { error: err.message };
        }
        console.error("Unknown error occurred");
        return { error: "Unknown error occurred" };
    }
}

export async function toggleSuccess(enrollmentNum: string): Promise<{ success?: any; error?: any }> {
    try {
        const response = await prisma.enrollmentNo.update({
            where: {
                rollNo: enrollmentNum,
            },
            data: {
                success: true,
            }
        });
        if (!response) {
            return { error: "No response from the database" };
        }
        return { success: response };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return { error: err.message };
        }
        console.error("Unknown error occurred");
        return { error: "Unknown error occurred" };
    }
}

export async function notFound(enrollmentNum: string): Promise<{ success?: any; error?: any }> {
    try {
        const response = await prisma.enrollmentNo.update({
            where: {
                rollNo: enrollmentNum,
            },
            data: {
                notFound: true,
            }
        });
        if (!response) {
            return { error: "No response from the database" };
        }
        return { success: response };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return { error: err.message };
        }
        console.error("Unknown error occurred");
        return { error: "Unknown error occurred" };
    }
}

export async function getAllResult(): Promise<{ success?: any; error?: any }> {
    try {
        const response = await prisma.result.findMany();
        return { success: response };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return { error: err.message };
        }
        console.error("Unknown error occurred");
        return { error: "Unknown error occurred" };
    }
}

export async function getAllRollno(): Promise<{ success?: any; error?: any }> {
    try {
        const response = await prisma.enrollmentNo.findMany();
        return { success: response };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return { error: err.message };
        }
        console.error("Unknown error occurred");
        return { error: "Unknown error occurred" };
    }
}

export async function reset():Promise<{success?: any; error?: any}> {
    try {
        const response = await prisma.enrollmentNo.updateMany({
            where: {
                success: false,
                picked: true,
                notFound: false,
            }, data: {
                picked: false,
            },
        });
        return { success: response.count };
    } catch (err: any) {
        console.error("Error: ", err.message);
        return { error: err.message };
    }
}