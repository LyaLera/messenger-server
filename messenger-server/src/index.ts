import express, { Request, Response, NextFunction } from 'express';
import knex from './db';
import cors from 'cors'
import { validationResult, body, param } from 'express-validator';
const app = express();
const PORT = 3304;
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.json());

const validMessage = [
    body("content")
    .notEmpty()
    .withMessage("Please type your message")
    .isLength({ min: 1, max: 250 })
    .trim()
    .escape(),

    body("conversation_id")
    .notEmpty().isUUID(),

    body("user_id")
    .notEmpty().isUUID(),
]

app.get("/", (req, res) => {
  res.send("Hello backend!")
});

app.get("/users", async (req, res, next) => {
    try {
        let users = await knex('users').select('*')
        res.status(200).json(
           users
        );
      } catch (err) {
        console.log(err);
        let errReport = new Error("Could not get users from DB");
        next(errReport);
      }
});

app.get("/conversations", async (req, res, next) => {
    try {
        let conversations = await knex('conversations').select('*')
        res.status(200).json(
           conversations
        );
      } catch (err) {
        console.log(err);
        let errReport = new Error("Could not get conversations from DB");
        next(errReport);
      }
});

app.get("/participation_events/conversation/:conversation_id", async (req, res, next) => {
  try {
      let participation_events = await knex('participation_events').select('*').where('conversation_id',req.params.conversation_id)
      res.status(200).json(
         participation_events
      );
    } catch (err) {
      console.log(err);
      let errReport = new Error("Could not get participation_events from DB");
      next(errReport);
    }
});

app.get("/messages/conversation/:conversation_id", async (req, res, next) => {
    console.log(req.params)
    try {
        let messages = await knex('messages').select('*').where('conversation_id',req.params.conversation_id).orderBy("created_at", "asc")
        res.status(200).json(
           messages
           
        );
      } catch (err) {
        console.log(err);
        let errReport = new Error("Could not get messeges from DB");
        next(errReport);
      }
});

app.post("/messages", validMessage, async (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  console.log(req.body)
  if (result.isEmpty()) {
      console.log('Request Body:', req.body);
    try {
      let [insertedRow] = await knex('messages').insert({
        content: req.body.content,
        user_id: req.body.user_id,
        conversation_id: req.body.conversation_id
      }).returning(['*']);
      res.status(201).json(
        insertedRow
      );
      console.log(insertedRow)
    } catch (err) {
      let errReport = new Error("Could not post message to DB");
      next(errReport);
    }
  } else {
    res.status(500).send({ errors: result.array() });
  }
});

app.post("/participation_events", async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
    try {
      let [participationEvent] = await knex('participation_events').insert({
        participant: req.body.participant,
        user_id: req.body.user_id,
        conversation_id: req.body.conversation_id
      }).returning(['*']);
      res.status(201).json(
        participationEvent
      );
      console.log(participationEvent)
    } catch (err) {
      let errReport = new Error("Could not post participation event to DB");
      next(errReport);
    }
});

app.put(
"/messages/:id", param("id").isUUID(),
validMessage,
async (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    console.log('Request Body:', req.body);
    try {
      let editedMessageDB = await knex('messages').where({id: req.params?.id})
        .update(
          {
            id: req.body.id,
            content: req.body.content,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at,
            user_id: req.body.user_id,
            conversation_id: req.body.conversation_id
          }
        );
        res.status(201).json({
          success: true,
          message: "Message was updated",
        });
        console.log(editedMessageDB)
    } catch (err) {
      let errReport = new Error("Could not edit message in a DB");
      next(errReport);
    }
  } else {
    res.status(500).send({ errors: result.array() });
  }
}
);

app.delete("/messages/:id", param("id").isUUID(), async (req, res, next) => {
try {
  let deletedMessageInDB = await knex('messages').where({id: req.params?.id}).del();
    res.status(200).json({
      success: true,
      message: "Message was deleted.",
    });
    console.log(deletedMessageInDB)
} catch (err) {
  let errReport = new Error("Could not delete message in a DB");
  next(errReport);
}
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});















