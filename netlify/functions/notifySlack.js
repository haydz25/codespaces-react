export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const orderData = JSON.parse(event.body);

    const slackMessage = {
      text: `🚨 *NEW HUBPUB ORDER!* 🍻\n\n*Who:* ${orderData.name}\n*Order:* ${orderData.order}\n*Total Due:* $${orderData.total}\n*Notes:* _${orderData.notes}_`
    };

    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) throw new Error("Failed to send message to Slack");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Slack alert fired successfully!" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};