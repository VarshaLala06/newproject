const sql = require('mssql');

exports.getResolutions = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM dbo.Resolutions`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({ error: 'Error querying the database' });
    }
};

exports.getResolutionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM dbo.Resolutions WHERE resolution_id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Resolution not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({ error: 'Error querying the database' });
    }
};

exports.createResolution = async (req, res) => {
    const { complaint_id, status, action_taken, resolution_date, resolution_proof_path } = req.body;

    if (!complaint_id || !status || !action_taken || !resolution_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await sql.query`
            INSERT INTO dbo.Resolutions (complaint_id, status, action_taken, resolution_date, resolution_proof_path)
            VALUES (${complaint_id}, ${status}, ${action_taken}, ${resolution_date}, ${resolution_proof_path.toString()})
        `;
        res.status(201).json({ message: 'Resolution inserted successfully' });
    } catch (err) {
        console.error('Error inserting resolution into the database: ', err);
        res.status(500).json({ error: 'Error inserting resolution into the database' });
    }
};