const Responses = require("../common/ApiResponses");
const Dynamo = require("../../database/Dynamo");
const { hooksWithValidation } = require("../common/hooks");
const yup = require("yup");

const tableName = process.env.tableName;

const bodySchema = yup.object().shape({
  score: yup.number().required(),
});

const pathSchema = yup.object().shape({
  ID: yup.string().required(),
});

const handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
    //failed without Id
    return Responses._400({ message: "Missing the ID from the path" });
  }

  let Id = event.pathParameters.ID;

  const { score } = event.body;

  const user = await Dynamo.get(Id, tableName).catch((err) => {
    console.log("Error in Dynamo Get", err);
    return null;
  });

  if (!user) {
    return Responses._400({ message: "User not found" });
  }

  await Dynamo.update({
    tableName,
    primaryKey: "ID",
    primaryKeyValue: Id,
    updateKey: "score",
    updateValue: score,
  });

  return Responses._200({
    message: "Score atualizado com sucesso.",
  });
};

exports.handler = hooksWithValidation({ bodySchema, pathSchema })(handler);
