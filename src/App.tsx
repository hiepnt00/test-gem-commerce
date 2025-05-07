import { useCallback, useEffect, useState } from "react";

const App = () => {
  const [unit, setUnit] = useState("percent");
  const [oldValue, setOldValue] = useState("");
  const [value, setValue] = useState("");
  const [tooltipMinus, setTooltipMinus] = useState(0);
  const [tooltipPlus, setTooltipPlus] = useState(0);

  const convertValue = useCallback(
    (valueParam?: string) => {
      let newValue = (valueParam || value)
        .replace(/[^\d.,-].*/g, "")
        .replace(/,/g, ".");

      if (newValue.split(".").length > 2) {
        newValue = newValue.split(".").slice(0, 2).join(".");
      }

      if (+newValue < 0) {
        newValue = "0";
      } else if (+newValue > 100 && unit === "percent") {
        newValue = oldValue;
      }

      setValue(newValue);
      setOldValue(newValue);
    },
    [oldValue, unit, value]
  );

  const onMinus = useCallback(() => {
    const newValue = parseFloat(value) - 1;
    convertValue(`${newValue}`);

    // check show tooltip
    if (newValue < 0) {
      setTooltipMinus((value) => ++value);
      setTimeout(() => {
        setTooltipMinus((value) => --value);
      }, 500);
    }
  }, [value, convertValue]);

  const onPlus = useCallback(() => {
    const newValue = parseFloat(value) + 1;
    convertValue(`${newValue}`);

    // check show tooltip
    if (newValue > 100 && unit === "percent") {
      setTooltipPlus((value) => ++value);
      setTimeout(() => {
        setTooltipPlus((value) => --value);
      }, 500);
    }
  }, [value, convertValue, unit]);

  useEffect(() => {
    if (unit === "percent" && +value > 100) {
      convertValue("100");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg p-2 w-max">
        <div className="flex items-center mb-4">
          <p className="w-[100px] mr-2 label">Unit</p>
          <div className="btn-unit w-[140px] flex">
            <div
              className={`percent flex items-center justify-center ${
                unit === "percent" ? "active" : "inactive"
              }`}
              onClick={() => setUnit("percent")}
            >
              <span>%</span>
            </div>
            <div
              className={`pixels flex items-center justify-center ${
                unit === "pixels" ? "active" : "inactive"
              }`}
              onClick={() => setUnit("pixels")}
            >
              <span>px</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <p className="w-[100px] mr-2 label">Value</p>
          <div className="btn-unit w-[140px] flex !p-0 number-input">
            <div
              className="minus flex items-center justify-center"
              onClick={onMinus}
            >
              <span>-</span>
              {!!tooltipMinus && (
                <span className="tooltip">Value must greater than 0</span>
              )}
            </div>
            <input
              type="text"
              className="w-16"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onBlur={() => convertValue()}
            />
            <div
              className="plus flex items-center justify-center"
              onClick={onPlus}
            >
              <span>+</span>
              {!!tooltipPlus && (
                <span className="tooltip">Value must smaller than 100</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
