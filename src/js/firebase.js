// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  // signInWithRedirect,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  // connectAuthEmulator,
} from 'firebase/auth';

import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
  push,
  update,
} from 'firebase/database';

// Initialize Firebase
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCrjIQ-i-DV-fkmDO-FB_HdRZGKiM7ste8',
  authDomain: 'filmoteka-project9.firebaseapp.com',
  projectId: 'filmoteka-project9',
  storageBucket: 'filmoteka-project9.appspot.com',
  messagingSenderId: '1031272501813',
  appId: '1:1031272501813:web:a2ca2d3955cbe4cf9a577c',
  measurementId: 'G-1NQ8JF0W90',
  databaseURL:
    'https://filmoteka-project9-default-rtdb.europe-west1.firebasedatabase.app/',
});

export const auth = getAuth(firebaseApp);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(firebaseApp);

export const dbRef = ref(db);

// ================= запуск локального эмулятора =================

//из это папки >>> C:\Filmoteka
//запуск хоcтинга >>> firebase serve --only hosting
//запуск эмулятора >>> firebase emulators:start --only auth

// connectAuthEmulator(auth, 'http://localhost:9099/');

// data base ===============================================================

function writeUserData(userId, name, email, imageUrl) {
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
}

// const userId = auth.currentUser.uid;
// return onValue(
//   ref(db, '/users/' + userId),
//   snapshot => {
//     const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//     // ...
//   },
//   {
//     onlyOnce: true,
//   }
// );
// ============================================================================

const refs = {
  btnCloseModal: document.querySelector('[data-signInModal-close]'),
  btnSignIn: document.querySelector('#signInModalOpen'),
  btnLogOut: document.querySelector('#logoutBtn'),
  btnLoginWithPhone: document.querySelector('#LogInWithPhoneBtn'),
  btnPhoneLogin: document.querySelector('#LogInPhone'),
  btnGoogleLogin: document.querySelector('#googleLoginBtn'),
  btnLoginWithEmail: document.querySelector('#loginWithEmailBtn'),
  btnLoginEmail: document.querySelector('#loginEmailBtn'),
  btnSignUpWithEmail: document.querySelector('#SignUpWitnEmailBtn'),
  btnSignUpEmail: document.querySelector('#SignUpBtn'),
  btnConfirmEmail: document.querySelector('#ConfirmEmail'),

  backdrop: document.querySelector('[data-signInModal]'),
  navigation: document.querySelector('.navigation__list'),
  boxUser: document.querySelector('.user__box'),
  boxSignInModal: document.querySelector('.signInModal__box'),
  boxSignInWithEmailModal: document.querySelector(
    '.signInModal__signInWithEmail'
  ),
  boxSignUpWithEmail: document.querySelector('.signInModal__signUpWithEmail'),
  boxLogInWithPhone: document.querySelector('.signInModal__LogInWithPhone'),
  boxRecaptcha: document.querySelector('.recaptcha-container'),

  loginEmail: document.querySelector('#email'),
  loginPassword: document.querySelector('#password'),
  signUpEmail: document.querySelector('#emailSignUp'),
  signUpPassword: document.querySelector('#passwordSignUp'),
  loginPhone: document.querySelector('#phone'),
  loginPhoneCode: document.querySelector('#loginPhoneCode'),

  userName: document.querySelector('.user__name'),
  formField: document.querySelector('.auth-form__field'),
  formTitle: document.querySelector('.auth-form__title'),
};

// close Modal Func auth =====================================================================================

export const closeModalFunc = () => {
  refs.btnCloseModal.addEventListener('click', () => {
    refs.backdrop.classList.add('backdrop--hidden');
    refs.boxSignInWithEmailModal.classList.add('visually-hidden');
    refs.boxSignUpWithEmail.classList.add('visually-hidden');
    // refs.boxLogInWithPhone.classList.add('visually-hidden');
    refs.boxSignInModal.classList.remove('visually-hidden');
  });

  if (refs.backdrop.classList.contains('backdrop--hidden')) {
    btnCloseModal.removeEventListener('click', toggleModal);
  }
};

// monitor Auth State =====================================================================================

const monitorAuthState = async () => {
  try {
    onAuthStateChanged(auth, user => {
      if (user) {
        // console.log(user);

        switch (true) {
          case user.displayName !== null && user.photoURL !== null:
            refs.boxUser.innerHTML = `<img class="user__img" src= ${user.photoURL} alt="" />
                                  <p class="user__greeting">Good to see You again</p>
                                  <p class="user__name"> ${user.displayName}</p>`;
            break;

          case user.displayName === null && user.photoURL === null:
            refs.boxUser.innerHTML = `<p class="user__greeting">Good to see You again</p>
                                  <p class="user__name">Logged in as ${user.email}</p>`;
            break;

          default:
            break;
        }
        refs.navigation.innerHTML = `<li class="navigation__item">
          <a class="navigation__link navigation__link--current" href="">HOME</a>
        </li>
        <li class="navigation__item">
          <a class="navigation__link" href="./my-library.html">MY LIBRARY</a>
        </li>`;

        refs.btnSignIn.classList.add('visually-hidden');
        refs.btnLogOut.classList.remove('visually-hidden');
        refs.backdrop.classList.add('backdrop--hidden');
        refs.btnLogOut.addEventListener('click', logOut);
        refs.btnSignIn.removeEventListener('click', onbtnSignInClick);
      } else {
        refs.boxUser.innerHTML = `<p class="user__name">Hello Stranger</p>`;
        refs.navigation.innerHTML = ``;
        refs.btnSignIn.classList.remove('visually-hidden');
        refs.btnLogOut.classList.add('visually-hidden');
        refs.btnLogOut.removeEventListener('click', logOut);
        refs.btnSignIn.addEventListener('click', onbtnSignInClick);
      }
    });
  } catch (error) {
    showLoginError(error);
  }
};

monitorAuthState();

// on btn SignIn Click =====================================================================================

const onbtnSignInClick = e => {
  event.preventDefault();
  refs.backdrop.classList.remove('backdrop--hidden');
  refs.btnGoogleLogin.addEventListener('click', onBtnGoogleLoginClick);
  refs.btnLoginWithEmail.addEventListener('click', onbtnLoginWithEmailClick);
  refs.btnSignUpWithEmail.addEventListener('click', onBtnSignUpWithEmailClick);
  closeModalFunc();
};

const logOut = async () => {
  await signOut(auth);
};

// show Login Error =====================================================================================

const showLoginError = error => {
  if (error.message == 'Firebase: Error (auth/wrong-password).') {
    alert('Wrong password, Try again');
  }
  if (error.message == 'Firebase: Error (auth/invalid-email).') {
    alert(`Invalid email, Try again`);
  } else {
    alert(`${error.message}`);
  }
};

// create Account  =====================================================================================

const onBtnSignUpWithEmailClick = () => {
  refs.btnGoogleLogin.removeEventListener('click', onBtnGoogleLoginClick);
  refs.btnLoginWithEmail.removeEventListener('click', onbtnLoginWithEmailClick);
  refs.btnLoginEmail.removeEventListener('click', loginEmailPasspord);
  refs.btnSignUpEmail.addEventListener('click', createAccount);
  refs.boxSignUpWithEmail.classList.remove('visually-hidden');
  refs.boxSignInModal.classList.add('visually-hidden');
};

const createAccount = async e => {
  e.preventDefault();
  const email = refs.signUpEmail.value;
  const password = refs.signUpPassword.value;

  if (email && password) {
    refs.backdrop.classList.add('backdrop--hidden');
    refs.boxSignUpWithEmail.classList.add('visually-hidden');
    refs.boxSignInModal.classList.remove('visually-hidden');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    user = userCredential.user;

    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
  } catch (error) {
    showLoginError(error);
  }
};

// sign In With Email And Password auth =====================================================================================

const onbtnLoginWithEmailClick = () => {
  refs.btnGoogleLogin.removeEventListener('click', onBtnGoogleLoginClick);
  refs.btnLoginWithEmail.removeEventListener('click', onbtnLoginWithEmailClick);
  refs.btnLoginEmail.addEventListener('click', loginEmailPasspord);
  refs.boxSignInWithEmailModal.classList.remove('visually-hidden');
  refs.boxSignInModal.classList.add('visually-hidden');
};

const loginEmailPasspord = async e => {
  e.preventDefault();
  const email = refs.loginEmail.value;
  const password = refs.loginPassword.value;

  if (email && password) {
    refs.backdrop.classList.add('backdrop--hidden');
    refs.boxSignInWithEmailModal.classList.add('visually-hidden');
    refs.boxSignInModal.classList.remove('visually-hidden');
  }

  try {
    // console.log(auth);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log(userCredential);
  } catch (error) {
    showLoginError(error);
  }
};

// google auth =====================================================================================

const provider = new GoogleAuthProvider();

provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

provider.setCustomParameters({
  login_hint: 'user@example.com',
});

export const onBtnGoogleLoginClick = e => {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...

      get(child(dbRef, `users/${user.uid}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
          } else {
            writeUserData(
              user.uid,
              user.displayName,
              user.email,
              user.photoURL
            );
          }
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

// add to watched ============================================================================

export const onAddToWatchedBtnClick = async (filmId, filmName) => {
  try {
    onAuthStateChanged(auth, user => {
      if (user) {
        AddToWatched(user.uid, filmId, filmName);
      } else {
        console.log('no user');
      }
    });
  } catch (error) {
    showLoginError(error);
  }
};

function AddToWatched(uid, filmId, filmName) {
  get(child(dbRef, `users/${uid}/watched`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const postData = { [filmId]: filmName };
        update(child(dbRef, `users/${uid}/watched`), postData);
      } else {
        const postData = { watched: { [filmId]: filmName } };
        update(child(dbRef, `users/${uid}`), postData);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// add to queue =================================================================================

export const onAddToQueueBtnClick = async (filmId, filmName) => {
  try {
    onAuthStateChanged(auth, user => {
      if (user) {
        addToQueue(user.uid, filmId, filmName);
      } else {
        console.log('no user');
      }
    });
  } catch (error) {
    showLoginError(error);
  }
};

function addToQueue(uid, filmId, filmName) {
  get(child(dbRef, `users/${uid}/queue`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const postData = { [filmId]: filmName };
        update(child(dbRef, `users/${uid}/queue`), postData);
      } else {
        const postData = { queue: { [filmId]: filmName } };
        update(child(dbRef, `users/${uid}`), postData);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// функция получения просмотренных фильмов ======================================================

// export const getWatched = async () => {
//   try {
//     onAuthStateChanged(auth, user => {
//       if (user) {
//         get(child(dbRef, `users/${user.uid}/watched`))
//           .then(snapshot => {
//             if (snapshot.exists()) {
//               console.log(snapshot.val());
//             } else {
//               console.log('No data available');
//             }
//           })
//           .catch(error => {
//             console.error(error);
//           });
//       } else {
//         console.log('no user');
//       }
//     });
//   } catch (error) {
//     showLoginError(error);
//   }
// };

// export function getWatched(uid) {
//   get(child(dbRef, `users/${uid}/watched`))
//     .then(snapshot => {
//       if (snapshot.exists()) {
//         console.log(snapshot.val());
//       } else {
//         console.log('No data available');
//       }
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }
