// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWoN6EA85uoqxxGfQdGT0pSr7PB9hVy4c",
  authDomain: "monopoly-go-b6f54.firebaseapp.com",
  databaseURL: "https://monopoly-go-b6f54-default-rtdb.firebaseio.com",
  projectId: "monopoly-go-b6f54",
  storageBucket: "monopoly-go-b6f54.firebasestorage.app",
  messagingSenderId: "476161979772",
  appId: "1:476161979772:web:9a5d627021f4a000a9e0f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export functions for managing events
export function loadEventsFromFirebase(callback) {
  const eventsRef = ref(database, 'events');
  onValue(eventsRef, (snapshot) => {
    const data = snapshot.val();
    const events = data ? Object.entries(data).map(([key, value]) => ({
      id: key,
      name: value.name,
      emoji: value.emoji || ""
    })) : [];
    callback(events);
  });
}

export function addEventToFirebase(eventName, eventEmoji = "") {
  const eventsRef = ref(database, 'events');
  const newEventRef = push(eventsRef);
  return set(newEventRef, {
    name: eventName,
    emoji: eventEmoji,
    timestamp: Date.now()
  });
}

export function removeEventFromFirebase(eventId) {
  const eventRef = ref(database, `events/${eventId}`);
  return remove(eventRef);
}

export function initializeDefaultEvents() {
  const defaultEvents = [
    { name: "Board Rush", emoji: ":MGT_Event_BoardRush:" },
    { name: "Builder's Bash", emoji: ":MGT_Event_BuildersBash:" },
    { name: "Cash Boost", emoji: ":MGT_Event_CashBoost:" },
    { name: "Cash Grab", emoji: ":MGT_Event_CashGrab:" },
    { name: "Free Parking Cash", emoji: ":MGT_Event_FreeParkingCash:" },
    { name: "Free Parking Dice", emoji: ":MGT_Event_FreeParkingDice:" },
    { name: "Golden Blitz", emoji: ":MGT_Event_GoldenBlitz~1:" },
    { name: "High Roller", emoji: ":MGT_Event_HighRoller_old:" },
    { name: "PEG-E", emoji: ":MGT_Event_Sticker_PEG_E:" },
    { name: "Treasures", emoji: ":MGT_Event_Sticker_EgyptTreasures:" },
    { name: "Sticker Boom", emoji: ":MGT_Event_StickerBoom~1:" },
    { name: "Roll Match", emoji: ":MGT_Event_RollMatch:" },
    { name: "Rent Frenzy", emoji: ":MGT_Event_RentFrenzy:" },
    { name: "Mega Heist", emoji: ":MGT_Event_MegaHeist:" },
    { name: "Lucky Chance", emoji: ":MGT_Event_LuckyChance:" },
    { name: "Landmark Rush", emoji: ":MGT_Event_LandmarkRush:" },
    { name: "Wheel Boost", emoji: ":MGT_Event_WheelBoost:" },
    { name: "Address Book Connect", emoji: ":card_index:" },
    { name: "Facebook Connect", emoji: ":facebook:" },
    { name: "Tycoon Racers", emoji: ":MGT_Event_TycoonRacers:" },
    { name: "Juggle Sort", emoji: ":JuggleSort_MDS:" }
  ];

  return new Promise((resolve) => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      if (!snapshot.exists()) {
        // Only initialize if no events exist
        const promises = defaultEvents.map(event => {
          const newEventRef = push(eventsRef);
          return set(newEventRef, {
            name: event.name,
            emoji: event.emoji,
            timestamp: Date.now()
          });
        });
        Promise.all(promises).then(resolve);
      } else {
        resolve();
      }
    }, { onlyOnce: true });
  });
}
