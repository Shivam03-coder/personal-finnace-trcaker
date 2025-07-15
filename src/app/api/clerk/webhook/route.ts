import { db } from "@/server/db";

export const POST = async (req: Request) => {
  const { data } = await req.json();
  const emailAddress = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;
  const id = data.id;

  const name = `${firstName} ${lastName}`;
  const profileUrl = imageUrl;
  const email = emailAddress;

  try {
    await db.user.create({
      data: {
        id,
        email,
        profileUrl,
        name,
      },
    });
  } catch (error) {
    console.log(" error:", error);
    return new Response("Webhook failed", { status: 200 });
  }

  return new Response("Webhook received", { status: 200 });
};
