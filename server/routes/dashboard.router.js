const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        pool.query(`SELECT * FROM "order" 
                    WHERE "person_id" =${req.user.id};`).then((results) => {
            res.send(results.rows);
        }).catch((error) => {
            console.log('error in dashboard get', error);
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
    
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
    if (req.isAuthenticated()) {
        // moment().format('L');
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT * FROM "fulfillment" WHERE "date" = CURRENT_DATE
                                 AND "order_id" = ${req.body.id};`;
                let response = await client.query(queryText)

                if (response.rows.length === 0) {
                queryText = `INSERT INTO "fulfillment"("order_id","person_id")
                    VALUES($1,$2) RETURNING "id";`;
                let values = [req.body.id, req.body.person];
                let results = await client.query(queryText, values);
                const resultsId = results.rows[0].id;

                queryText = `SELECT "product"."product_name", "order_product"."product_id"
                             FROM "product" JOIN "order_product" 
                             ON "product"."id" = "order_product"."product_id" 
                             WHERE "order_product"."order_id" =$1;`
                values=[req.body.id]
                let responses = await client.query(queryText,values)
                console.log('response', responses.rows);
                
                
                
                for(product of responses.rows){
                    queryText = `INSERT INTO "product_fulfillment"
                             ("fulfillment_id","product_id")
                             VALUES ($1,$2)  RETURNING "product_id";`;
                    values = [resultsId, product.product_id]
                    await client.query(queryText, values);
                }
                await client.query('COMMIT');
                res.send(results.rows)
                }else{
                res.sendStatus(201)

                }
            } catch (e) {
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        })().catch((error) => {
                console.log('error in dashboard post', error);
                res.sendStatus(500);
            })
    }
    else {
        res.sendStatus(403);
    }
})

module.exports = router;