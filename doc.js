const swaggerAutogen = require('swagger-autogen')()

// https://www.npmjs.com/package/swagger-autogen#usage-with-optionals
const doc = {
    info: {
        version: "1.0.0",
        title: "DP API",
        description: "API doc"
    },
    host: "localhost:1337",
    basePath: "/api/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        "bearerAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Bearer token obtained from authentication server"
        }
    },
    definitions: {
        "DataStatus": {
            "type": "string",
            "enum": [
                "OFFLINE",
                "ONLINE",
                "UNKNOWN",
                "REMOVED"
            ]
        },
        "BaseModel": {
            "type": "object",
            "properties": {
                "status": {
                    "$ref": "#/definitions/DataStatus"
                }
            }
        },
        "User": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Unique ID of the user"
                },
                "email": {
                    "type": "string",
                    "description": "Email address of the user"
                },
                "name": {
                    "type": "string",
                    "description": "Name of the user"
                },
                "updated_at": {
                    "type": "string",
                    "description": "Timestamp of when the user was last updated"
                }
            }
        },
        "Ski": {
            "type": "object",
            "allOf": [
                {
                    "$ref": "#/definitions/BaseModel"
                }
            ],
            "properties": {
                "id": {
                    "type": "string",
                    "format": "uuid"
                },
                "name": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "icon": {
                    "type": "string"
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        },
        "DataBody": {
            "type": "object",
            "properties": {
                "userID": {
                    "type": "string"
                },
                "data": {
                    "$ref": "#/definitions/BaseModel"
                }
            }
        },
        "SkiDataBody": {
            "type": "object",
            "properties": {
                "userID": {
                    "type": "string"
                },
                "ski": {
                    "$ref": "#/definitions/Ski"
                }
            }
        },
        "TestSession": {
            "type": "object",
            "allOf": [
                {
                    "$ref": "#/definitions/BaseModel"
                }
            ],
            "properties": {
                "id": {
                    "type": "string",
                    "description": "The unique identifier of the test session"
                },
                "datetime": {
                    "type": "string",
                    "format": "date-time",
                    "description": "The date and time of the test session"
                },
                "airTemperature": {
                    "type": "number",
                    "description": "The air temperature during the test session"
                },
                "snowTemperature": {
                    "type": "number",
                    "description": "The snow temperature during the test session"
                },
                "snowType": {
                    "type": "integer",
                    "description": "The type of snow during the test session"
                },
                "testType": {
                    "type": "integer",
                    "description": "The type of test performed during the test session"
                },
                "humidity": {
                    "type": "number",
                    "description": "The humidity during the test session (optional)"
                },
                "note": {
                    "type": "string",
                    "description": "Additional notes about the test session (optional)"
                },
                "updatedAt": {
                    "type": "string",
                    "description": "ISO8601 date string"
                }
            }
        },
        "SkiRide": {
            "type": "object",
            "allOf": [
                { "$ref": "#/definitions/BaseModel" }
            ],
            "properties": {
                "id": {
                    "type": "string",
                    "description": "The unique identifier for the ski ride"
                },
                "skiID": {
                    "type": "string",
                    "description": "The identifier for the ski"
                },
                "testSessionID": {
                    "type": "string",
                    "description": "The identifier for the test session"
                },
                "result": {
                    "type": "number",
                    "format": "double",
                    "description": "The result of the ski ride"
                },
                "note": {
                    "type": "string",
                    "nullable": true,
                    "description": "The note for the ski ride"
                },
                "updatedAt": {
                    "type": "string",
                    "description": "The date and time when the ski ride was last updated"
                }
            }
        }
    }


}

const outputFile = './docAPI.json'
const endpointsFiles = ['./routes/api.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {  
   
    console.log("OK!");
     //require('./app.js'); 
})


