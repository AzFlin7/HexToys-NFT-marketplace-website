import React, { useState, useContext } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

import { useActiveWeb3React } from "./hooks";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import "antd/dist/antd.css";

import { connectors, connectorLocalStorageKey } from './utils/connectors';
import { useEagerConnect } from "./hooks/useEagerConnect";

import ConnectDialog from './components/ConnectDialog';

import Collection from "./pages/collection/collection";
import EditCollection from "./pages/edit-collection";
import CreateMultiple from "./pages/create/create-multiple";
import CreateSingle from "./pages/create/create-single";
import ImportCollection from "./pages/import-collection/import-collection";
import Detail from "./pages/detail/detail";
import EditProfile from "./pages/edit-profile";
import ExploreCollections from "./pages/explore-collections/explore-collections";
import ExploreItems from "./pages/explore-items/explore-items";
import Home from "./pages/home/home";
import Profile from "./pages/profile";
import Search from "./pages/search/search";
import MysteryBoxes from "./pages/mysteryboxes";
import MysteryBoxDetail from "./pages/mysterybox-detail";
import ThemeContext from './context/ThemeContext';
import clsx from 'clsx';
import NftStaking from "./pages/nft-staking";
import HexToys from "./pages/hex-toys/hex-toys";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Create from "./pages/create_choose/create";

function App() {
  const { theme } = useContext(ThemeContext)
  const [connectModalOpen, setConnectModalOpen] = useState(null);

  const { activate } = useActiveWeb3React();
  const connectAccount = () => {
    setConnectModalOpen(true);
  }
  const connectToProvider = (connector) => {
    activate({connector: connector})
  }

  useEagerConnect();

  window.onscroll = () => {

    let progressbar_pc = document.getElementById('progressbar_pc');
	  let totalHeight = document.body.scrollHeight - window.innerHeight;
		let progressHeight = (window.pageYOffset / totalHeight) * 100;
		progressbar_pc.style.height = progressHeight + "%";

    let progressbar_mob = document.getElementById('progressbar_mob');
	  // let totalWidth = document.body.scrollHeight - window.innerHeight;
		// let progressWidth = (window.pageXOffset / totalHeight) * 100;
		progressbar_mob.style.width = progressHeight + "%";
    
		return () => (window.onscroll = null);
	}

  return (
    <div className={clsx("App", `bg_${theme}`)}>
      <div id="progressbar_pc"></div>
      <div id="progressbar_mob"></div>
      <Toaster
        position="top-center"
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 3000 },
        }}
      />
      <Router>
        <Switch>
          <Route path="/" exact render={(props) => (<Home {...props} connectAccount={connectAccount} />)} />
          <Route path="/home" exact render={(props) => (<Home {...props} connectAccount={connectAccount} />)} />
          <Route path="/hex-toys" exact render={(props) => (<HexToys {...props} connectAccount={connectAccount} />)} />
          <Route path="/search/:searchTxt" exact render={(props) => (<Search {...props} connectAccount={connectAccount} />)} />
          <Route path="/detail/:collection/:tokenID" exact render={(props) => (<Detail {...props} connectAccount={connectAccount} />)} />
          <Route path="/explore-collections" exact render={(props) => (<ExploreCollections {...props} connectAccount={connectAccount} />)} />
          <Route path="/explore-items" exact render={(props) => (<ExploreItems {...props} connectAccount={connectAccount} />)} />
          <Route path="/collection/:collection" exact render={(props) => (<Collection {...props} connectAccount={connectAccount} />)} />
          <Route path="/profile/:id" exact render={(props) => (<Profile {...props} connectAccount={connectAccount} />)} />
          <Route path="/edit_profile" exact render={(props) => (<EditProfile {...props} connectAccount={connectAccount} />)} />
          <Route path="/edit_collection/:collection" exact render={(props) => (<EditCollection {...props} connectAccount={connectAccount} />)} />
          <Route path="/create" exact render={(props) => (<Create {...props} connectAccount={connectAccount} />)} />
          <Route path="/create-single" exact render={(props) => (<CreateSingle {...props} connectAccount={connectAccount} />)} />
          <Route path="/create-multiple" exact render={(props) => (<CreateMultiple {...props} connectAccount={connectAccount} />)} />
          <Route path="/import" exact render={(props) => (<ImportCollection {...props} connectAccount={connectAccount} />)} />
          <Route path="/mysteryboxes" exact render={(props) => (<MysteryBoxes {...props} connectAccount={connectAccount} />)} />
          <Route path="/mysterybox/:address" exact render={(props) => (<MysteryBoxDetail {...props} connectAccount={connectAccount} />)} />
          <Route path="/nft-staking" exact render={(props) => (<NftStaking {...props} connectAccount={connectAccount} />)} />          
          <Route path="/leaderboard" exact render={(props) => (<Leaderboard {...props} connectAccount={connectAccount} />)} />          
        </Switch>
      </Router>

      <ConnectDialog
        open={!!connectModalOpen}
        handleClose={(event, reason) => {
          if (reason === "backdropClick") {
            return false;
          }
          if (reason === "escapeKeyDown") {
            return false;
          }
          setConnectModalOpen(false)
        }}
        connectors={connectors}
        connectToProvider={connectToProvider}
        connectorLocalStorageKey={connectorLocalStorageKey}
      />

    </div>
  );
}

export default App;
