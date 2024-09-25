
import result from "./utils/getResult";
import app from './server'
import { addResult, next, notFound, reset, togglePicked, toggleSuccess } from "./models/dbAction";

import cluster from "cluster";
import os from 'os';
import { Result } from "@prisma/client";


async function getResult() {
    while (true) {
        try {
            console.log("getting result");
            const enrollmentNo = await next();

            if ('error' in enrollmentNo) {
                // console.log("error: ", enrollmentNo.error);
                throw new Error(enrollmentNo.error);
            } else if ('rollNo' in enrollmentNo) {
                // console.log(enrollmentNo?.rollNo);
                const response = await result(enrollmentNo?.rollNo);

                if (response.error) {
                    // console.log("Error : ", response.error);
                    await togglePicked(enrollmentNo.rollNo);
                } else if (response.msg) {
                    // console.log("something going wrong!");
                    await togglePicked(enrollmentNo.rollNo);
                } else if (response.NotFound) {
                    // console.log("result not available for this roll no");
                    await toggleSuccess(enrollmentNo.rollNo);
                    await notFound(enrollmentNo.rollNo);
                    await Promise.all([toggleSuccess, notFound]);
                } else if (response.WrongCaptcha) {
                    // console.log("wrong captcha");
                    // console.log("retrying..");
                    continue;
                } else {
                    // console.log(response);
                    await toggleSuccess(enrollmentNo.rollNo);
                    await addResult(response as Result);
                    await Promise.all([toggleSuccess, addResult])
                }
            }

        } catch (err: any) {
            console.log("ERROR: ",err.message);
            if(err.message === "No enrollmentNo found"){
                console.log("calling reset funciton...");
                const count = await reset();
                if(count.success === 0){
                    console.log("no change occur..");
                    // cluster.worker?.disconnect(); 
                    console.log("Cluster closed due to error.");
                    break;
                }else {
                    console.log("Unhandled error: ", err.message);
                    // cluster.disconnect();
                    console.log("Cluster disconnected due to an error.");
                    break;
                }
            }
        }
    }
};

// getResult();
// app.listen(3000, ()=> console.log("server is running . . ."))

// in the case of multithreading...

async function start() {
    if (cluster.isPrimary) {
        console.log("Master has been started...");
        await reset();
        app.listen(3000, () => console.log("server is running..."));
        const NUM_WORKERS = os.cpus().length;
        for (let i = 0; i < NUM_WORKERS; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
            if (code !== 0) {
                console.log("Restarting a new worker...");
                cluster.fork();  // Fork a new worker if the old one died unexpectedly
            }
        });
    } else {
        console.log("Worker process has been started...");
        await getResult();
    }
}

start();
