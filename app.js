
document.addEventListener("DOMContentLoaded", function () {
  const calculateBtn = document.getElementById("calculateBtn");
  const results = document.getElementById("results");

  function getValue(id) {
    const value = document.getElementById(id).value;
    return value === "" ? null : Number(value);
  }

  function format(value, decimals = 2) {
    return Number.isFinite(value)
      ? value.toFixed(decimals)
      : "Not available";
  }

  calculateBtn.addEventListener("click", function () {
    const weight = getValue("weight");
    const age = getValue("age");
    const glucose = getValue("glucose");
    const ph = getValue("ph");
    const bicarbonate = getValue("bicarbonate");
    const sodium = getValue("sodium");
    const potassium = getValue("potassium");
    const chloride = getValue("chloride");
    const urea = getValue("urea");
    const ketones = getValue("ketones");

    const values = [
      weight, age, glucose, ph, bicarbonate,
      sodium, potassium, chloride, urea, ketones
    ];

    if (values.some(v => v === null || !Number.isFinite(v))) {
      results.textContent =
        "Please complete all fields with valid numerical values.";
      return;
    }

    if (
      weight <= 0 || age < 0 || glucose < 0 ||
      sodium <= 0 || potassium < 0 ||
      chloride < 0 || urea < 0 || ketones < 0
    ) {
      results.textContent =
        "Please check the entered values. Some values cannot be negative or zero.";
      return;
    }

    // Calculations for educational interpretation only.
    const correctedSodium =
      sodium + (1.6 * (glucose - 5.6) / 5.6);

    const anionGap =
      sodium - (chloride + bicarbonate);

    const calculatedOsmolality =
      (2 * sodium) + glucose + urea;

    const dkaCriteria =
      glucose > 11 &&
      ketones >= 3 &&
      (ph < 7.30 || bicarbonate < 18);

    let severity = "No DKA severity category assigned";

    if (dkaCriteria) {
      if (ph < 7.10 || bicarbonate < 5) {
        severity = "Severe DKA range";
      } else if (ph < 7.20 || bicarbonate < 10) {
        severity = "Moderate DKA range";
      } else {
        severity = "Mild DKA range";
      }
    }

    results.innerHTML = `
      <h3>Patient data</h3>
      <p>Weight: ${format(weight, 1)} kg</p>
      <p>Age: ${format(age, 1)} years</p>

      <h3>Calculated values</h3>
      <p>Corrected sodium: ${format(correctedSodium)} mmol/L</p>
      <p>Anion gap: ${format(anionGap)} mmol/L</p>
      <p>Calculated osmolality: ${format(calculatedOsmolality)} mOsm/kg</p>

      <h3>DKA screening</h3>
      <p>DKA biochemical criteria: ${dkaCriteria ? "Criteria met" : "Criteria not met"}</p>
      <p>Acidosis severity range: ${severity}</p>

      <h3>Electrolytes and blood results</h3>
      <p>Glucose: ${format(glucose)} mmol/L</p>
      <p>pH: ${format(ph, 2)}</p>
      <p>Bicarbonate: ${format(bicarbonate)} mmol/L</p>
      <p>Potassium: ${format(potassium)} mmol/L</p>
      <p>Ketones: ${format(ketones)} mmol/L</p>

      <p><strong>Clinical note:</strong> Interpret these results in context and confirm against your hospital's pediatric DKA protocol.</p>
    `;
  });
});
