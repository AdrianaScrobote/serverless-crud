const Responses = require("../common/ApiResponses");
const Dynamo = require("../../database/Dynamo");

const tableName = process.env.tableName;

exports.handler = async (event) => {
  console.log("event", event);

  if (!event.pathParameters || !event.pathParameters.ID) {
    //failed without Id
    return Responses._400({ message: "Missing the ID from the path" });
  }

  let Id = event.pathParameters.ID;

  const user = await Dynamo.get(Id, tableName).catch((err) => {
    console.log("Error in Dynamo Get", err);
    return null;
  });

  if (!user) {
    return Responses._400({ message: "User not found" });
  }

  return Responses._200({
    user,
  });
};
