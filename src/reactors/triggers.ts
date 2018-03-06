import { Watcher } from "./watcher";

import { actions } from "../actions";

import { sortBy } from "underscore";
import { Space } from "../helpers/space";

export default function(watcher: Watcher) {
  watcher.on(actions.commandMain, async (store, action) => {
    const { tab } = store.getState().profile.navigation;
    const sp = Space.fromStore(store, tab);

    if (sp.prefix === "games") {
      const game = sp.game();
      if (game) {
        // FIXME: queueGame doesn't always do the right thing.
        // it'll try installing even if there's no chance you'll be able
        // to download it (for example, if you need to purchase it first)
        store.dispatch(actions.queueGame({ game }));
      }
    }
  });

  watcher.on(actions.commandMain, async (store, action) => {
    const modals = store.getState().modals;
    const modal = modals[0];

    if (modal) {
      return;
    }

    const page = store.getState().profile.navigation.page;
    const picking = store.getState().profile.login.picking;
    if (page === "gate" && picking) {
      const rememberedProfiles = store.getState().rememberedProfiles;
      const mostRecentProfile = sortBy(
        rememberedProfiles.profiles,
        x => -x.lastConnected
      )[0];
      if (mostRecentProfile) {
        store.dispatch(actions.useSavedLogin({ profile: mostRecentProfile }));
      }
    }
  });

  watcher.on(actions.commandBack, async (store, action) => {
    const modals = store.getState().modals;
    const [modal] = modals;

    if (modal) {
      store.dispatch(actions.closeModal({}));
    }
  });
}
