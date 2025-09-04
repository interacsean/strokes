export enum Strike {
  Clean = "Clean",
  Thin = "Thin",
  Fat = "Fat",
  Shank = "Shank",
  Slice = "Slice",
  Hook = "Hook",
  Skyball = "Skyball",
  Push = "Push",
  Pull = "Pull",
}

export const StrikeLabels: Record<Strike, string> = {
  [Strike.Clean]: "Clean",
  [Strike.Thin]: "Thin",
  [Strike.Fat]: "Fat",
  [Strike.Shank]: "Shank",
  [Strike.Slice]: "Slice",
  [Strike.Hook]: "Hook",
  [Strike.Skyball]: "Skyball",
  [Strike.Push]: "Push",
  [Strike.Pull]: "Pull",
};