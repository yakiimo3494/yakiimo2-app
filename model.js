let model;
async function loadModel() {
  model = await tf.loadLayersModel('data/model.json');
}
loadModel();

async function predictSales(input) {
  if (!model) await loadModel();
  const tensor = tf.tensor2d([input]);
  const prediction = model.predict(tensor);
  const result = await prediction.data();
  return result[0].toFixed(1);
}