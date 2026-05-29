import { Inngest } from "inngest";
import User from "../models/User.js";
import { connectDB } from "./db.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },

  async ({ event }) => {

    console.log("FUNCTION STARTED");

    await connectDB();

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url
    } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    console.log("Saving User To Mongo");

    await User.create(newUser);

    console.log("Mongo Saved");

    console.log("Calling Stream");

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage
    });

    console.log("FUNCTION FINISHED");

    return { success: true };
  }
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }],
  },

  async ({ event }) => {

    console.log("DELETE FUNCTION STARTED");

    await connectDB();

    const { id } = event.data;

    console.log("Deleting Mongo User");

    await User.deleteOne({ clerkId: id });

    console.log("Deleting Stream User");

    await deleteStreamUser(id.toString());

    console.log("DELETE FUNCTION FINISHED");

    return { success: true };
  }
);

export const functions = [
  syncUser,
  deleteUserFromDB
];

// import { Inngest } from "inngest";
// import User from "../models/User.js";
// import { connectDB } from "./db.js";
// import { deleteStreamUser, upsertStreamUser } from "./stream.js";
// export const inngest = new Inngest({ id: "talent-iq" });

// const syncUser = inngest.createFunction(
//   {
//     id: "sync-user",
//     triggers: [{ event: "clerk/user.created" }],
//   },
//   async ({ event }) => {
//     await connectDB();

//     const { id, email_addresses, first_name, last_name, image_url } =
//       event.data;

//     const newUser = {
//       clerkId: id,
//       email: email_addresses[0]?.email_address,
//       name: `${first_name || ""} ${last_name || ""}`,
//       profileImage: image_url,
//     };

//     await User.create(newUser);

//     await upsertStreamUser({
//       id: newUser.clerkId.toString(),
//       name: newUser.name,
//       image: newUser.profileImage
//     });

//     return { success: true };
//   }
// );

// const deleteUserFromDB = inngest.createFunction(
//   {
//     id: "delete-user-from-db",
//     triggers: [{ event: "clerk/user.deleted" }],
//   },
//   async ({ event }) => {
//     await connectDB();

//     const { id } = event.data;

//     await User.deleteOne({ clerkId: id });

//     await deleteStreamUser(id.toString());

//     return { success: true };
//   }
// );

// export const functions = [syncUser, deleteUserFromDB];



