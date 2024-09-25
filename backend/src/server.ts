import express from 'express';
import cors from 'cors';

import { getList } from './utils/libs';
import { createList, getAllResult, getAllRollno } from './models/dbAction';

const app = express();

app.use(express.json());
app.use(cors());

app.post('/results', async (req: express.Request, res: express.Response) => {
    try {
        const { batch } = req.body;
        if (!batch) {
            return res.status(400).send('Batch is required');
        }
        const list = getList(batch);

        const response = await createList(list);

        if (response.error) {
            return res.status(500).json(response);
        }
        return res.status(201).json(response);

    } catch (error: any) {
        console.error('Error fetching list:', error.message);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/results', async(req, res) => {
    try{
        const response = await getAllResult();
        if(response.error){
            return res.status(404).json({error: "No result found"})
        };
        return res.status(201).json(response.success);
    }catch(err: any){
        console.error(err.message);
        return res.status(500).json(err);
    }
});

app.get('/rollno', async(req, res) => {
    try{
        const response = await getAllRollno();
        if(response.error){
            return res.status(404).json({error: "No result found"})
        };
        return res.status(201).json(response.success);
    }catch(err: any){
        console.error(err.message);
        return res.status(500).json(err);
    }
})

export default app;