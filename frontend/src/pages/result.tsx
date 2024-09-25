import axios from "axios";
import { useEffect, useState } from "react";

interface ResultData {
    rollNo: string;
    name: string;
    cgpa: string;
    resultDes:string;
}

export const Result = () => {

    const [data, setData] = useState<ResultData[] | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sortConfig: { key: keyof ResultData; direction: "asc" | "desc" } = { key: "rollNo", direction: "asc" };

    const sortData = (dataToSort: ResultData[], key: keyof ResultData, direction: "asc" | "desc") => {
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
                const response = await axios.get("http://localhost:3000/results");
                if (response.status !== 201) {
                    setError("An error occurred while fetched the Result.");
                    setSuccess(null);
                } else {
                    const sortedData = sortData(response.data, sortConfig.key, sortConfig.direction);
                    setData(sortedData);
                    setSuccess("Result fetched successfully.");
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
                            <th className="px-4 py-0.5 border border-gray-300">Name</th>
                            <th className="px-4 py-0.5 border border-gray-300">cgpa</th>
                            <th className="px-4 py-0.5 border border-gray-300">Result Des.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((roll) => (
                            <tr key={roll.rollNo}>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.rollNo}</td>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.name}</td>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.cgpa}</td>
                                <td className="px-4 py-0.5 border border-gray-300">{roll.resultDes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>)
}