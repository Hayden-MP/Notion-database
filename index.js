const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function addToDatabase(databaseId, uniqueId, name, status, date) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: {
                'ID': {
                    type: 'title',
                    title: [
                    {
                        type: 'text',
                        text: {
                            content: uniqueId,
                        },
                    },
                    ],
                },
                'Name' : {
                        type: 'rich_text',
                        rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: name,
                            },
                        }
                        ],
                },
                'Status': {
                    type: 'checkbox',
                    checkbox: status
                },
                'Date': { // Date is formatted YYYY-MM-DD
                    type: 'date',
                    date: date
                },
            }    
        });
        console.log(response);
    } catch (error) {
        console.error(error.body);
    }
}

async function queryDatabase(databaseId, username) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            "filter": {
                "property": "ID",
                "rich_text": {
                    "contains": username
                }
            }
          });  
        return response.results[0].id;
    } catch (error){
        console.log(error.body);
    }
}

function updateItem(databaseId, username, status, inputDate) {    
    queryDatabase(databaseId, username)
        .then(async pageId => {
            try {
                const response = await notion.pages.update({
                    page_id: pageId,
                    properties: {
                        'Status': {
                            checkbox: status,
                        },
                        'Date': { 
                            type: 'date',
                            date: {
                                "start": inputDate
                            }
                        },
                    },
                    });
                console.log(response);
            } catch (error) {
                console.log(error.body);
            }
        });
}

function deleteItem(databaseId, username) {
    try {
        queryDatabase(databaseId, username)
            .then(async pageId => {

                const response = await notion.blocks.delete({
                    block_id: pageId,
                });
                console.log(response);

            })
    } catch (error) {
        console.log(error.body);
    }
}


//addToDatabase(databaseId, 'davidjones123', 'David Jones', false, null);

// queryDatabase(databaseId, 'davidjones123')
//     .then(result => {
//         console.log(result);
//     });

//updateItem(databaseId, 'davidjones123', true, "2022-08-22");

//deleteItem(databaseId, 'davidjones123');