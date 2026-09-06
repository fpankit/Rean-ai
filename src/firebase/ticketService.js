import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

const TICKETS_COLLECTION = "support_tickets";

// Pre-seeded demo cases for Supervisor console
const INITIAL_DEMO_TICKETS = [
  {
    id: "TCK-8901",
    callerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    languagesUsed: ["Hindi", "English"],
    category: "Wi-Fi Technical Support",
    urgency: "High",
    status: "Escalated",
    confidenceScore: 62,
    noiseLevel: "High (Street Chatter)",
    reasonForTransfer: "Low voice confidence & code-switched location detail",
    summary: "Caller reported Wi-Fi router disconnection and red light in Sector 14. Spoke in Hindi first ('Mera Wi-Fi band ho gaya hai'), then switched to English.",
    extractedSlots: {
      name: "Rahul Sharma",
      contact: "+91 98765 43210",
      location: "Sector 14, Dwarka",
      category: "No Internet Connection",
      confirmed: false
    },
    safetyStatus: "Clean",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: "TCK-8902",
    callerName: "Ananya Roy",
    phone: "+91 91234 56789",
    languagesUsed: ["English"],
    category: "Municipal Services",
    urgency: "Medium",
    status: "Open",
    confidenceScore: 94,
    noiseLevel: "Low",
    reasonForTransfer: "Standard Information Collection Complete",
    summary: "Inquired about street light repairs near Community Park. Details confirmed and queued for municipal crew dispatch.",
    extractedSlots: {
      name: "Ananya Roy",
      contact: "+91 91234 56789",
      location: "Community Park Gate 2",
      category: "Street Light Repair",
      confirmed: true
    },
    safetyStatus: "Clean",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

// Helper for local storage backup
const getLocalTickets = () => {
  const stored = localStorage.getItem("echosphere_tickets");
  if (!stored) {
    localStorage.setItem("echosphere_tickets", JSON.stringify(INITIAL_DEMO_TICKETS));
    return INITIAL_DEMO_TICKETS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DEMO_TICKETS;
  }
};

const saveLocalTickets = (tickets) => {
  localStorage.setItem("echosphere_tickets", JSON.stringify(tickets));
};

export const createTicket = async (ticketData) => {
  const newTicket = {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    ...ticketData,
    createdAt: new Date().toISOString(),
    status: ticketData.status || "Escalated"
  };

  try {
    const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
      ...newTicket,
      timestamp: serverTimestamp()
    });
    console.log("Ticket created in Firestore with ID: ", docRef.id);
    // Also backup locally
    const current = getLocalTickets();
    saveLocalTickets([newTicket, ...current]);
    return { ...newTicket, docId: docRef.id };
  } catch (error) {
    console.warn("Firestore save fallback to LocalStorage:", error);
    const current = getLocalTickets();
    const updated = [newTicket, ...current];
    saveLocalTickets(updated);
    return newTicket;
  }
};

export const subscribeToTickets = (callback) => {
  try {
    const q = query(collection(db, TICKETS_COLLECTION), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));
      if (tickets.length > 0) {
        callback(tickets);
      } else {
        callback(getLocalTickets());
      }
    }, (error) => {
      console.warn("Firestore snapshot error, loading local tickets:", error);
      callback(getLocalTickets());
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Using local tickets fallback");
    callback(getLocalTickets());
    return () => {};
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    // Update local storage first
    const current = getLocalTickets();
    const updated = current.map(t => t.id === ticketId ? { ...t, status } : t);
    saveLocalTickets(updated);

    // Attempt Firestore update
    const q = query(collection(db, TICKETS_COLLECTION));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      if (document.data().id === ticketId) {
        const docRef = doc(db, TICKETS_COLLECTION, document.id);
        await updateDoc(docRef, { status });
      }
    });
  } catch (err) {
    console.warn("Firestore update error:", err);
  }
};
