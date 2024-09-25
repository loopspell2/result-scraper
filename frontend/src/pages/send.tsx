import axios from "axios";
import { useState } from "react";


export const Send = () => {
    const [size, setSize] = useState<number | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value as string, 10) : null;
        setSize(value);
    }


    const onCreate = async () => {
        try {
            if (size === null || size <= 0) {
                setError("Please enter a valid batch size.");
                setSuccess(null);
                return;
            }

            const response = await axios.post("http://localhost:3000/results", { batch: size });

            if (response.status !== 201) {
                setError("An error occurred while creating the batch.");
                setSuccess(null);
            } else {
                setSuccess("Batch created successfully.");
                setError(null);
            }
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
    };

    return (
        <>
            <div className="bg-neutral-700 w-[80%] h-[100px] rounded-xl mt-14 flex items-center justify-center">
                <div className="flex items-center justify-center">
                    <div >
                        <label
                            htmlFor="batch"
                            className="mr-4"
                        >
                            Enter Batch Size:
                        </label>
                        <input
                            id="batch"
                            name="batch"
                            type="number"
                            min="1"
                            onChange={handleInputChange}
                            className="bg-neutral-600 outline-none w-16 rounded-md p-1 ml-4 no-spinner"
                        />
                        <button
                            className="bg-blue-300 text-black p-1 ml-4 rounded-md"
                            onClick={onCreate}
                        >
                            Create
                        </button>
                        {success ?
                            (<p className="text-green-400">{success}</p>)
                            : error ?
                                (<p className="text-red-400">error</p>)
                                : null
                        }
                    </div>
                </div>
            </div>
        </>
    );
};
