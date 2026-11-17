"use strict";
/**
 * Kaamzo MongoDB Atlas + Mongoose Models (with Automatic AES-256-GCM Encryption & HMAC-SHA256 Blind Indexes)
 *
 * Mirrors all 7 legacy Firestore collections:
 *  1. workers               -> WorkerModel
 *  2. jobs                  -> JobModel
 *  3. verifications         -> VerificationModel
 *  4. disputes              -> DisputeModel
 *  5. accounts              -> AccountModel
 *  6. sosAlerts             -> SosAlertModel
 *  7. securityVerifications -> SecurityVerificationModel
 */
const mongoose = require("mongoose");
const dns = require("dns");
const {
  encryptDocumentFields,
  decryptDocumentFields,
  hashPhoneForLookup,
  hashEmailForLookup,
  hmacBlindIndex
} = require("./encryption");

// Ensure SRV records (mongodb+srv://) resolve reliably even when local Windows/ISP DNS blocks SRV queries
try {
  const currentServers = dns.getServers();
  dns.setServers(Array.from(new Set(["8.8.8.8", "1.1.1.1", "8.8.4.4", ...currentServers])));
} catch (_) {}

let connectionPromise = null;

async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (connectionPromise) {
    return connectionPromise;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env");
  }

  connectionPromise = mongoose
    .connect(uri, {
      dbName: "kaamzo",
      tls: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000
    })
    .then((m) => {
      return m.connection;
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}

// Common schema options: strict: false allows all dynamic fields from Kaamzo's frontend
// while enforcing explicit indexes and AES-256-GCM encrypted fields.
const schemaOptions = {
  strict: false,
  timestamps: false,
  versionKey: false,
  minimize: false
};

// 1. WORKERS COLLECTION
const WorkerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true }, // Firebase Auth UID
    username: { type: String, index: true },
    userId: { type: String, index: true },
    name: { type: String, required: true, index: true },
    phone: { type: String }, // Encrypted with AES-256-GCM (enc:v1:...)
    phoneHash: { type: String, index: true }, // Searchable HMAC-SHA256 blind index
    email: { type: String }, // Encrypted with AES-256-GCM
    emailHash: { type: String, index: true }, // Searchable HMAC-SHA256 blind index
    primaryTrade: { type: String, index: true },
    trade: { type: String, index: true },
    dailyRate: { type: Number, index: true },
    rate: { type: Number },
    area: { type: String, index: true },
    city: { type: String, index: true },
    address: { type: String }, // Encrypted with AES-256-GCM
    aadhaarNumber: { type: String }, // Encrypted with AES-256-GCM
    aadhaarHash: { type: String, index: true },
    upiId: { type: String }, // Encrypted with AES-256-GCM
    isVerified: { type: Boolean, index: true },
    isOnline: { type: Boolean, index: true },
    rating: { type: Number, index: true },
    walletBalance: { type: Number, default: 0 },
    syncedAt: { type: String, index: true }
  },
  { ...schemaOptions, collection: "workers" }
);

// 2. JOBS COLLECTION
const JobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true }, // Firebase Auth UID of creator/worker
    title: { type: String, required: true },
    trade: { type: String, index: true },
    dailyWage: { type: Number, index: true },
    area: { type: String, index: true },
    locationAddress: { type: String }, // Encrypted with AES-256-GCM
    customerId: { type: String, index: true },
    customerName: { type: String, index: true },
    customerPhone: { type: String }, // Encrypted with AES-256-GCM
    customerPhoneHash: { type: String, index: true }, // Searchable HMAC-SHA256
    assignedWorkerId: { type: String, index: true },
    assignedWorkerName: { type: String },
    assignedWorkerPhone: { type: String }, // Encrypted with AES-256-GCM
    workerPhoneHash: { type: String, index: true }, // Searchable HMAC-SHA256
    assignedWorkerUpi: { type: String }, // Encrypted with AES-256-GCM
    status: { type: String, index: true },
    createdAt: { type: String, index: true },
    syncedAt: { type: String, index: true }
  },
  { ...schemaOptions, collection: "jobs" }
);

// 3. VERIFICATIONS COLLECTION
const VerificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true },
    workerId: { type: String, index: true },
    username: { type: String, index: true },
    workerName: { type: String, index: true },
    phone: { type: String }, // Encrypted with AES-256-GCM
    phoneHash: { type: String, index: true },
    email: { type: String }, // Encrypted with AES-256-GCM
    emailHash: { type: String, index: true },
    address: { type: String }, // Encrypted with AES-256-GCM
    aadhaarNumber: { type: String }, // Encrypted with AES-256-GCM
    aadhaarHash: { type: String, index: true },
    upiId: { type: String }, // Encrypted with AES-256-GCM
    status: { type: String, index: true },
    syncedAt: { type: String, index: true }
  },
  { ...schemaOptions, collection: "verifications" }
);

// 4. DISPUTES COLLECTION
const DisputeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true },
    jobId: { type: String, index: true },
    customerName: { type: String },
    customerPhone: { type: String }, // Encrypted with AES-256-GCM
    customerPhoneHash: { type: String, index: true },
    workerId: { type: String, index: true },
    workerName: { type: String },
    workerPhone: { type: String }, // Encrypted with AES-256-GCM
    workerPhoneHash: { type: String, index: true },
    status: { type: String, index: true },
    amount: { type: Number },
    syncedAt: { type: String, index: true }
  },
  { ...schemaOptions, collection: "disputes" }
);

// 5. ACCOUNTS COLLECTION
const AccountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true }, // Firebase Auth UID
    username: { type: String, index: true },
    name: { type: String, index: true },
    phone: { type: String }, // Encrypted with AES-256-GCM
    phoneHash: { type: String, index: true }, // Searchable HMAC-SHA256 blind index
    email: { type: String }, // Encrypted with AES-256-GCM
    emailHash: { type: String, index: true }, // Searchable HMAC-SHA256 blind index
    role: { type: String, index: true },
    passwordHash: { type: String },
    syncedAt: { type: String, index: true }
  },
  { ...schemaOptions, collection: "accounts" }
);

// 6. SOS ALERTS COLLECTION
const SosAlertSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true },
    workerId: { type: String, index: true },
    workerName: { type: String },
    phone: { type: String }, // Encrypted with AES-256-GCM
    phoneHash: { type: String, index: true },
    status: { type: String, index: true },
    syncedAt: { type: String, index: true }
  },
  { ...schemaOptions, collection: "sosAlerts" }
);

// 7. SECURITY VERIFICATIONS COLLECTION (OTPs)
const SecurityVerificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    identifier: { type: String }, // Encrypted with AES-256-GCM
    identifierHash: { type: String, index: true },
    codeHash: { type: String },
    salt: { type: String },
    attempts: { type: Number, default: 0 },
    type: { type: String },
    role: { type: String },
    dispatchedAt: { type: String },
    expiresAt: { type: String, index: true },
    syncedAt: { type: String }
  },
  { ...schemaOptions, collection: "securityVerifications" }
);

// 8. MESSAGES COLLECTION (Multi-Device Encrypted In-App Chat)
const MessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true },
    threadKey: { type: String, required: true, index: true },
    senderId: { type: String },
    senderPhone: { type: String }, // Encrypted with AES-256-GCM
    senderName: { type: String },
    senderRole: { type: String },
    text: { type: String }, // Encrypted with AES-256-GCM
    timestamp: { type: Number, index: true },
    syncedAt: { type: String, index: true }
  },
  { ...schemaOptions, collection: "messages" }
);

const MODELS = {
  workers: mongoose.models.Worker || mongoose.model("Worker", WorkerSchema),
  jobs: mongoose.models.Job || mongoose.model("Job", JobSchema),
  verifications: mongoose.models.Verification || mongoose.model("Verification", VerificationSchema),
  disputes: mongoose.models.Dispute || mongoose.model("Dispute", DisputeSchema),
  accounts: mongoose.models.Account || mongoose.model("Account", AccountSchema),
  sosAlerts: mongoose.models.SosAlert || mongoose.model("SosAlert", SosAlertSchema),
  securityVerifications:
    mongoose.models.SecurityVerification ||
    mongoose.model("SecurityVerification", SecurityVerificationSchema),
  messages: mongoose.models.Message || mongoose.model("Message", MessageSchema)
};

function getModel(collectionName) {
  const model = MODELS[collectionName];
  if (!model) {
    throw new Error(`Unknown collection: ${collectionName}`);
  }
  return model;
}

/**
 * Encrypts sensitive fields with AES-256-GCM + computes HMAC-SHA256 blind indexes,
 * and upserts the document into MongoDB Atlas.
 */
async function upsertDoc(collectionName, docId, payload, firebaseUser = null) {
  await connectMongo();
  const Model = getModel(collectionName);
  const cleanId = String(docId || payload.id || `doc_${Date.now()}`).trim();

  const merged = {
    ...payload,
    id: cleanId,
    syncedAt: new Date().toISOString()
  };

  if (firebaseUser && firebaseUser.uid && !merged.uid) {
    merged.uid = firebaseUser.uid;
  }

  const encryptedDoc = encryptDocumentFields(merged);

  const saved = await Model.findOneAndUpdate(
    { id: cleanId },
    { $set: encryptedDoc },
    { upsert: true, returnDocument: "after", lean: true }
  );

  return decryptDocumentFields(saved);
}

/**
 * Fetches a single document by ID and decrypts all AES-256-GCM fields.
 */
async function getDocById(collectionName, docId) {
  await connectMongo();
  const Model = getModel(collectionName);
  const doc = await Model.findOne({ id: String(docId).trim() }).lean();
  if (!doc) return null;
  return decryptDocumentFields(doc);
}

/**
 * Lists documents in a collection (up to limitCount) and decrypts all AES-256-GCM fields.
 */
async function listDocs(collectionName, limitCount = 100, filter = {}) {
  await connectMongo();
  const Model = getModel(collectionName);
  const cap = Math.min(500, Math.max(1, Number(limitCount) || 100));
  const sortOrder = collectionName === "messages" ? { timestamp: 1 } : { syncedAt: -1 };
  const docs = await Model.find(filter).sort(sortOrder).limit(cap).lean();
  return docs.map(decryptDocumentFields);
}

/**
 * Searchable Blind-Index Lookup by Phone Number (for AI Voice Receptionist, Customer Care & Login)
 * Uses HMAC-SHA256 `phoneHash` index so MongoDB never scans or decrypts unrelated records.
 */
async function lookupByPhone(phone) {
  await connectMongo();
  const phoneHash = hashPhoneForLookup(phone);
  if (!phoneHash) return { workers: [], accounts: [], jobs: [] };

  const [workers, accounts, jobs] = await Promise.all([
    MODELS.workers.find({ phoneHash }).limit(10).lean(),
    MODELS.accounts.find({ phoneHash }).limit(10).lean(),
    MODELS.jobs
      .find({ $or: [{ customerPhoneHash: phoneHash }, { workerPhoneHash: phoneHash }] })
      .sort({ syncedAt: -1 })
      .limit(20)
      .lean()
  ]);

  return {
    workers: workers.map(decryptDocumentFields),
    accounts: accounts.map(decryptDocumentFields),
    jobs: jobs.map(decryptDocumentFields)
  };
}

/**
 * Purges all documents across all 7 collections (Admin Reset).
 */
async function purgeAllCollections() {
  await connectMongo();
  const names = Object.keys(MODELS);
  await Promise.all(names.map((name) => MODELS[name].deleteMany({})));
  return { purgedCollections: names };
}

module.exports = {
  connectMongo,
  MODELS,
  getModel,
  upsertDoc,
  getDocById,
  listDocs,
  lookupByPhone,
  purgeAllCollections,
  hashPhoneForLookup,
  hashEmailForLookup,
  hmacBlindIndex
};
