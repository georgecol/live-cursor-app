import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

async function fetchUsers() {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => doc.data());
  console.log(userList);
}