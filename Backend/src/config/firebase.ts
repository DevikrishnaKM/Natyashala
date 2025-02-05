import admin from "firebase-admin";
import serviceAccount from "../../natyashala-937cf-firebase-adminsdk-fbsvc-f17560a532.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export { admin };