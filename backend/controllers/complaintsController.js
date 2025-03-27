const sql = require('mssql');
const server = require('../server');

exports.getComplaints = async (req, res) => {
    try {
        const result = await sql.query`SELECT *
                                       FROM dbo.Complaint`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.getComplaintById = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await sql.query`SELECT *
                                       FROM dbo.Complaint
                                       WHERE complaint_id = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({error: 'Complaint not found'});
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({error: 'Error querying the database'});
    }
};

exports.createComplaint = async (req, res) => {
    const {newspaper_name, publication_date, issue_category, issue_description, created_at} = req.body;

    if (!newspaper_name || !publication_date || !issue_category || !issue_description || !created_at) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try {
        const result = await sql.query`
            INSERT INTO dbo.Complaint (newspaper_name, publication_date, issue_category, issue_description, created_at)
                OUTPUT INSERTED.*
            VALUES (${newspaper_name}, ${publication_date}, ${issue_category}, ${issue_description}, ${created_at})
        `;
        const insertedId = result?.recordset?.[0]?.complaint_id;

        if (!insertedId) {
            throw new Error("Failed to retrieve inserted ID.");
        }

        // Notify all connected clients
        server.notifyClients({
            id: insertedId,
            newspaper_name,
            publication_date,
            issue_category,
            issue_description,
            created_at
        });

        res.status(201).json({message: 'Complaint inserted successfully'});
    } catch (err) {
        console.error('Error inserting complaint into the database: ', err);
        res.status(500).json({error: 'Error inserting complaint into the database'});
    }
};

exports.getPendingComplaints = async (req, res) => {
    try {
        //TODO: update query to fetch pending records
        const result = await sql.query`SELECT *
                                       FROM dbo.Complaint
                                       WHERE CONVERT(DATE, created_at) <= CONVERT(DATE, GETDATE())`

        const pendingComplaints = result.recordset;

        if (pendingComplaints.length === 0) {
            return res.status(404).json({message: 'No pending complaints found'});
        }

        res.json(pendingComplaints);
    } catch (error) {
        console.error("Error fetching pending complaints:", error);
        res.status(500).json({message: 'Server error'});
    }
};
