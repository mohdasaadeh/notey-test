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

describe("Model Test", function () {
  describe("check keylist", function () {
    before(async function () {
      await store.create("n1", "Note 1", "Note 1");
      await store.create("n2", "Note 2", "Note 2");
      await store.create("n3", "Note 3", "Note 3");
    });

    it("should have three entries", async function () {
      const keyz = await store.keylist();

      assert.exists(keyz);
      assert.isArray(keyz);
      assert.lengthOf(keyz, 3);
    });

    it("should have keys n1 n2 n3", async function () {
      const keyz = await store.keylist();

      assert.exists(keyz);
      assert.isArray(keyz);
      assert.lengthOf(keyz, 3);

      for (let key of keyz) {
        assert.match(key, /n[123]/, "correct key");
      }
    });

    it("should have titles Note #", async function () {
      const keyz = await store.keylist();

      assert.exists(keyz);
      assert.isArray(keyz);
      assert.lengthOf(keyz, 3);

      const keyPromises = keyz.map((key) => store.read(key));

      const notez = await Promise.all(keyPromises);

      for (let note of notez) {
        assert.match(note.title, /Note [123]/, "correct title");
      }
    });

    after(async function () {
      const keyz = await store.keylist();

      for (let key of keyz) {
        await store.destroy(key);
      }
    });
  });

  describe("read note", function () {
    before(async function () {
      await store.create("n1", "Note 1", "Note 1");
    });

    it("should have proper note", async function () {
      const note = await store.read("n1");

      assert.exists(note);

      assert.deepEqual(
        {
          key: note.key,
          title: note.title,
          body: note.body,
        },
        {
          key: "n1",
          title: "Note 1",
          body: "Note 1",
        }
      );
    });

    it("Unknown note should fail", async function () {
      try {
        const note = await store.read("badkey12");

        assert.notExists(note);

        throw new Error("should not get here");
      } catch (err) {
        // An error is expected, so it is an error if
        // the 'should not get here' error is thrown
        assert.notEqual(err.message, "should not get here");
      }
    });

    after(async function () {
      const keyz = await store.keylist();

      for (let key of keyz) {
        await store.destroy(key);
      }
    });
  });
});
