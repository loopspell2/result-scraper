import axios from "axios";
import { useEffect, useState } from "react";

interface RollData {
    rollNo: string;
    success: boolean;
    picked: boolean;
    notFound: boolean;
}

export const Rollno = () => {

    const [data, setData] = useState<RollData[] | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sortConfig: { key: keyof RollData; direction: "asc" | "desc" } = { key: "rollNo", direction: "asc" };

    const sortData = (dataToSort: RollData[], key: keyof RollData, direction: "asc" | "desc") => {
        return [...dataToSort].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    useEffect(() => {
        try {
            async function getRollno() {
                const response = await axios.get("http://localhost:3000/rollno");
                if (response.status !== 201) {
                    setError("An error occurred while fetched the batch.");
                    setSuccess(null);
                } else {
                    const sortedData = sortData(response.data, sortConfig.key, sortConfig.direction);
                    setData(sortedData);
                    setSuccess("Batch fetched successfully.");
                    setError(null);
                }
            }

            getRollno();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError("An error occurred: " + error.message);
            } else if (error instanceof Error) {
                setError("An error occurred: " + error.message);
            } else {
                setError("An unknown error occurred.");
            }
            setSuccess(null);

        }
    }, []);

    return (<>
        <div className="bg-neutral-600 rounded-lg p-2 mt-4">
            <div className="flex items-center justify-center">
                <table className="table-auto border-collapse border border-gray-300">
                    <caption className="caption-bottom">
                        {success ?
                            (<p className="text-green-400">{success}</p>)
                            : error ?
                                (<p className="text-red-400">error</p>)
                                : null
                        }
                    </caption>
                    <thead className="sticky top-0 bg-neutral-700 z-10">
                        <tr>
                            <th className="px-4 py-0.5 border border-gray-300">Roll No.</th>
                            <th className="px-4 py-0.5 border border-gray-300">Success</th>
                            <th className="px-4 py-0.5 border border-gray-300">Picked</th>
                            <th className="px-4 py-0.5 border border-gray-300">Not found</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((roll) => (
                            <tr key={roll.rollNo}>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.rollNo}</td>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.success ? "Yes" : "No"}</td>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.picked ? "Yes" : "No"}</td>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.notFound ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>)
}