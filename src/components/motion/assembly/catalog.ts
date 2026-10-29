import type { AssemblyId } from "@/content/assembly";
import type { AssemblyModel } from "./kit";
import { bridge, building, pipeline, road } from "./models";
import { culvert, house, tower, township, warehouse } from "./models-homes";
import { network, verticalsWorld } from "./models-world";

/** Every model by id; loaded with the scene, never on the server. */
export function buildModel(id: AssemblyId): AssemblyModel {
  switch (id) {
    case "bridge":
      return bridge();
    case "road":
      return road();
    case "building":
      return building();
    case "pipeline":
      return pipeline();
    case "house":
      return house();
    case "tower":
      return tower();
    case "culvert":
      return culvert();
    case "warehouse":
      return warehouse();
    case "township":
      return township();
    case "verticals":
      return verticalsWorld();
    case "network":
      return network();
  }
}
