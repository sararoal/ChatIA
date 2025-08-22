import express from "express";
import Conversation from "../mongo/models/Conversation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import axios from "axios";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId?.toString();
    const { fields } = req.query;

    // Construir proyección si hay campos especificados
    let projection = null;

    if (fields) {
      const selectedFields = fields.split(',').join(' ');
      // Siempre incluimos _id
      projection = selectedFields + ' _id';
    }

    // Ejecutar la consulta con o sin proyección
    const conversations = projection
      ? await Conversation.find({ userId }).select(projection)
      : await Conversation.find({ userId });

    res.json(conversations);
  } catch (err) {
    console.error("❌ Error en GET /conversation:", err);
    res.status(500).json({ message: "Error al obtener conversaciones", error: err.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { fields } = req.query;
    let projection = null;

    if (fields) {
      const selectedFields = fields.split(',').join(' ');
      projection = selectedFields + ' _id'; // Siempre incluir _id
    }

    const conversation = projection
      ? await Conversation.findById(req.params.id).select(projection)
      : await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }

    res.json(conversation);
  } catch (err) {
    console.error("❌ Error en GET /conversation/:id:", err);
    res.status(500).json({ message: "Error al obtener la conversación", error: err.message });
  }
});

// POST: Crear conversación usando el userId del token
router.post("/", authMiddleware, async (req, res) => {
  const { title, messages } = req.body;
  const userId = req.user.userId?.toString();

  if (!userId) {
    return res.status(400).json({ message: "userId no encontrado en el token" });
  }

  const conversation = new Conversation({
    title,
    userId,
    messages: messages || [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    const newConversation = await conversation.save();
    res.status(201).json(newConversation);
  } catch (err) {
    console.error("❌ Error en POST /conversation:", err);
    res.status(400).json({ message: "Error al crear conversación", error: err.message });
  }
});

// PUT: Actualizar una conversación existente
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    updateFields.updatedAt = new Date();

    const updatedConversation = await Conversation.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }

    res.json(updatedConversation);
  } catch (err) {
    console.error("❌ Error en PUT /conversation/:id:", err);
    res.status(500).json({ message: "Error al actualizar la conversación", error: err.message });
  }
});

router.get('/protected', authMiddleware, (req, res) => {
  // Si llegamos aquí es porque el token es válido y req.user existe
  res.json({ message: 'Acceso autorizado', user: req.user });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId?.toString();

    
    const deleted = await Conversation.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Conversación no encontrada o no autorizada" });
    }

    res.json({ message: "Conversación eliminada" });
  } catch (err) {
    console.error("❌ Error en DELETE /conversation/:id:", err);
    res.status(500).json({ message: "Error al eliminar la conversación", error: err.message });
  }
});

router.post("/ia", async (req, res) => {
  const systemPrompt = "Eres un asistente virtual conversacional. Responde de forma breve, clara y natural, como si estuvieras hablando con una persona, usando Markdown para los títulos, listas y párrafos si es necesario.";
  const mensajesIA = [];
  for (let i = 0; i < req.body.length; i++) {
    const msg = req.body[i];
    mensajesIA.push({
      role: msg.sender === 'yo' ? 'user' : 'assistant',
      content: msg.text
    });
  }
  const messages = [{ role: 'system', content: systemPrompt },...mensajesIA];
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/deephermes-3-llama-3-8b-preview:free',
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'Demo Chat IA',
        },
      }
    );
    const botMessage = response.data.choices[0].message.content;
    res.json({ response: botMessage });
  } catch (error) {
    console.error('Error llamando a OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al comunicarse con OpenRouter' });
  }
});

export default router;
