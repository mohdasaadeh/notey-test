import util from "util";
import Chai from "chai";

import { useModel as useNotesModel } from "../notey-notes/models/notes-store.mjs";

const assert = Chai.assert;

let store;

describe("Initialize", function () {
  this.timeout(100000);

  it("should successfully load the model", async function () {
    try {
      store = await useNotesModel(process.env.NOTES_MODEL);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
});
