const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");
const signInWithGoogleButton = document.getElementById(
  "signInWithGoogleButton"
);
const signInWithGithubButton = document.getElementById(
  "signInWithGithubButton"
);
const signOutBtn = document.getElementById("signOutButton");
const userDetails = document.getElementById("userDetails");

const Googleprovider = new firebase.auth.GoogleAuthProvider();
const GithubProvider = new firebase.auth.GithubAuthProvider();

signInWithGoogleButton.onclick = function () {
  auth.signInWithPopup(Googleprovider);
};

signInWithGithubButton.onclick = function () {
  auth.signInWithPopup(GithubProvider);
};
signOutBtn.onclick = () => {
  auth.signOut();
};

auth.onAuthStateChanged((user) => {
  if (user) {
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3><p>UserID: ${user.uid}</p>`;
  } else {
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});

const firestore = firebase.firestore();

const thingsList = document.getElementById("thingsList");
const createThing = document.getElementById("createThing");

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    thingsRef = firestore.collection("things");
    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;
      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(),
      });
    };

    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });

        thingsList.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe();
  }
});
