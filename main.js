import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import { initialize, checkCurrentStatus, signIn, signOut, fetchUser } from './oauth';

import './style.css';

const APP_ID = import.meta.env.VITE_APP_ID;

const btnAuth = document.getElementById('btnAuth');

async function loadMap() {
  const webmap = new WebMap({
    portalItem: {
      id: '574917231a6c41ba855adfaab3f13fd4'
    }
  });

  const view = new MapView({
    map: webmap,
    container: 'app'
  });

  view.ui.add(btnAuth, 'top-right');

  btnAuth.addEventListener('click', () => {
    signOut();
  });
}

async function loadApp() {
  const oauthInfo = initialize(APP_ID);
  let credential = await checkCurrentStatus(oauthInfo);

  if (!credential) {
    // signin
    credential = await signIn(oauthInfo);
    console.log('sign in', credential);
  }

  if (credential) {
    loadMap();
    const user = await fetchUser();
    console.log('User', user);
    btnAuth.innerText = `Log Out ${user.username}`;
  }
}

loadApp();


