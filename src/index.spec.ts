import * as assert from "assert";
import { suite, test } from "@testdeck/mocha";
import { Transformer } from "./index";

@suite
class TransformerTest {
  @test
  testEmptyObject() {
    assert.deepEqual(Transformer({}, {}), {});
  }

  @test
  testUndefinedObject() {
    assert.equal(Transformer(undefined, {}), undefined);
  }

  @test
  testNormalObject() {
    assert.deepEqual(
      Transformer(
        {
          level1: {
            sublevel1: {
              sublevel2: {
                attr1: "Attr_1",
              },
              array: [{ name: "Yop" }, { name: "Plop" }, { name: "Yop2" }],
            },
          },
        },
        {
          attr1: "$.level1.sublevel1.sublevel2.attr1",
          array: ["$.level1.sublevel1.array", { test: "$.name" }],
        }
      ),
      {
        attr1: "Attr_1",
        array: [{ test: "Yop" }, { test: "Plop" }, { test: "Yop2" }],
      }
    );
  }
}
