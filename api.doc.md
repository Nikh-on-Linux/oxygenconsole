Root Routes
GET /
JWT Required: No
Response: 200 OK (Text: "Hellow")
Authentication Routes (/auth)
GET /auth

JWT Required: No
Response: 200 OK (Text: "This is a router")
POST /auth/register

JWT Required: No
Responses:
201 Created: { message: "User created successfully", suc: true, user: { ... } }
400 Bad Request: Validation error object
409 Conflict: { message: "User already exist", suc: false }
500 Internal Server Error: { message: "Internal server error", suc: false }
POST /auth/register/agent

JWT Required: Yes
Responses:
201 Created: { success: true, agent: { ... }, apiKey: "..." }
403 Forbidden: { message: "Request denied: Agents cannot create other agents.", suc: false }
409 Conflict: { message: "Agent already exists", success: false }
500 Internal Server Error: { message: "Failed to register agent", success: false }
POST /auth/login

JWT Required: No
Responses:
200 OK: { success: true, message: "Login successfull", token: "..." }
401 Unauthorized: { success: false, message: "Invalid credentials" }
404 Not Found: { success: false, message: "User not found" }
GET /auth/agent

JWT Required: No (Supports Bearer JWT or API Key via headers x-api-key / x-secret-key)
Responses:
200 OK: Returns authenticated agent details
401 Unauthorized / 403 Forbidden: Authentication error object
User & Directory Routes (/user)
GET /user

JWT Required: No
Response: 200 OK (Text: "User api endpoint")
PATCH /user

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: Updated user profile details
400 Bad Request / 500 Internal Server Error
PATCH /user/password

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: Password update confirmation
400 Bad Request / 401 Unauthorized
GET /user/me

JWT Required: Yes
Responses:
200 OK: Returns user profile & recent files
404 Not Found / 500 Internal Server Error
GET /user/info

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: Detailed user info
401 Unauthorized
GET /user/agents

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: { success: true, agents: [ ... ] }
500 Internal Server Error
PATCH /user/agent/:id

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: Agent updated object
400 Bad Request / 404 Not Found
DELETE /user/agent/:id

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: { success: true, message: "Agent deleted successfully" }
404 Not Found / 500 Internal Server Error
POST /user/createfolder/:folderName

JWT Required: Auth required (JWT or API Key)
Responses:
201 Created: { success: true, folder: { ... } }
400 Bad Request / 409 Conflict
POST /user/move/folder

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: Move folder success status
400 Bad Request / 404 Not Found
POST /user/move/file/:filename

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: Move file success status
400 Bad Request / 404 Not Found
POST /user/rename/file/:filename

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: File renamed object
400 Bad Request / 404 Not Found
POST /user/rename/folder

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: Folder renamed object
400 Bad Request / 404 Not Found
POST /user/directory

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: { success: true, directory: [ ... ] }
404 Not Found / 500 Internal Server Error
Upload Routes (/upload)
POST /upload

JWT Required: No
Responses:
200 OK / 201 Created: File upload result
400 Bad Request / 500 Internal Server Error
POST /upload/init

JWT Required: Yes
Responses:
200 OK: { uploadId: "...", path: "..." }
400 Bad Request / 500 Internal Server Error
PUT /upload/:uploadId/parts/:partNumber

JWT Required: No
Responses:
200 OK: Chunk upload confirmation
400 Bad Request / 500 Internal Server Error
POST /upload/:uploadId/complete/:uploadfilehash

JWT Required: No
Responses:
200 OK: Combined file status & file object
400 Bad Request / 500 Internal Server Error
GET /upload/info/:status

JWT Required: Yes
Responses:
200 OK: Array of uploads matching status
404 Not Found
GET /upload/info/chunks/:uploadId

JWT Required: Yes
Responses:
200 OK: Array of uploaded chunk part numbers
404 Not Found
DELETE /upload/:uploadId

JWT Required: Yes
Responses:
200 OK: Upload deletion status
404 Not Found / 500 Internal Server Error
File Stream Routes (/stream)
GET /stream

JWT Required: No
Response: 200 OK (Text: "Streaming Endpoint")
GET /stream/:filename

JWT Required: Auth required (JWT or API Key)
Responses:
200 OK: File metadata/info
404 Not Found / 403 Forbidden
GET /stream/file/:object

JWT Required: No
Responses:
200 OK / 206 Partial Content: Binary file stream
404 Not Found