let model;
async function loadModel() {
  model = await tf.loadLayersModel('data/model.json');
}
async function predictSales(input) {
  const tensor = tf.tensor2d([input]);
  const prediction = model.predict(tensor);
  const result = await prediction.data();
  return result[0].toFixed(1);
}
loadModel();
