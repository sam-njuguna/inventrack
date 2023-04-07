import React, { useState, useEffect } from "react";
import { BsCheck2, BsPencilFill, BsThreeDotsVertical } from "react-icons/bs";
import { MdAdd, MdArrowDropDown } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

// const currencies = [
//   `$ __US Dollar`,
//   "€ __Euro",
//   "£ __British Pound",
//   "KSh __Kenya Shilling",
//   "Chf __Swiss Franc",
//   "¥ __Japanese Yen",
// ];
const currencies = [
  { symbol: "USD", name: "US Dollar" },
  { symbol: "EUR", name: "Euro" },
  { symbol: "GBP", name: "British Pound" },
  { symbol: "JPY", name: "Japanese Yen" },
  { symbol: "CAD", name: "Canadian Dollar" },
  { symbol: "AUD", name: "Australian Dollar" },
  { symbol: "CHF", name: "Swiss Franc" },
  { symbol: "CNY", name: "Chinese Yuan" },
  { symbol: "HKD", name: "Hong Kong Dollar" },
  { symbol: "SGD", name: "Singapore Dollar" },
  { symbol: "KSh", name: "Kenyan Shilling" },
];

function App() {
  const [items, setItems] = useState([]);
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false });
  useEffect(() => {
    // Load items from local storage on mount
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(savedItems);
    setTotalAmount(calculateTotalAmount(savedItems));
  }, []);

  useEffect(() => {
    // Save items to local storage when items state changes
    localStorage.setItem("items", JSON.stringify(items));
    setTotalAmount(calculateTotalAmount(items));
  }, [items]);

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.amount), 0);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if ((charge.trim() && amount.trim()) || (charge !== "" && amount > 0)) {
      if (editMode) {
        // If in edit mode, update the edited item
        const newItems = items.map((item) =>
          item.id === editId ? { ...item, charge, amount, currency } : item
        );
        setItems(newItems);
        setEditMode(false);
        setEditId(null);
      } else {
        // If not in edit mode, add a new item
        const newItem = {
          id: uuidv4(),
          charge,
          amount,
          date: new Date().toLocaleDateString(),
          month: new Date().toLocaleDateString("default", { month: "short" }),
          time: new Date().toLocaleTimeString(),
          selected: selectAll,
        };
        setItems([...items, newItem]);
        handleAlert({
          type: "add",
          text: "Item was added.",
        });
      }
      setCharge("");
      setAmount("");
    }
    setTotalAmount(calculateTotalAmount(items));
  };

  const handleDelete = () => {
    const newItems = items.filter((item) => !item.selected);
    setItems(newItems);
    setSelectAll(false);
    setTotalAmount(calculateTotalAmount(items));
    handleAlert({
      type: "delete",
      text: selectAll ? "Items deleted!" : "",
    });
  };

  const handleSelectAll = () => {
    const newItems = items.map((item) => ({ ...item, selected: !selectAll }));
    setItems(newItems);
    setSelectAll(!selectAll);
    handleAlert({
      type: "select",
      text: !selectAll ? "All item are selected on your list." : "",
    });
  };

  const handleEdit = (id) => {
    if (!editMode) {
      setEditMode(true);
      setEditId(id);
      const itemToEdit = items.find((item) => item.id === id);
      setCharge(itemToEdit.charge);
      setAmount(itemToEdit.amount);
    } else {
      return handleAlert({
        type: "edit",
        text: "You have edited the item.",
      });
    }
  };

  const handleAlert = ({ type, text }) => {
    setShowAlert({ show: true, type, text });
    setTimeout(() => {
      setShowAlert({ show: false });
    }, 2000);
  };

  return (
    <div className="width flex flex-col justify-center items-center h-screen pt-8">
      <div className="flex flex-col justify-center items-center gap-8">
        <h2 className="text-[3rem] font-bold">Budget Calculater</h2>
        <div className="bg-white all relative">
          {showAlert && (
            <div className="alert">
              <div className="absolute bottom-4 w-full">
                <div
                  className={`h-[80px] text-center rounded mx-8 flex justify-center items-center ${
                    showAlert.text ? `${showAlert.type}` : ""
                  }`}
                >
                  <p className={showAlert.text ? `` : "opacity-0"}>
                    {" "}
                    {showAlert.text}
                  </p>
                </div>
              </div>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 px-4 py-4"
          >
            <div className="flex items-center gap-8">
              <div className="relative">
                <label htmlFor="charge" className="absolute -top-5">
                  Charge
                </label>
                <input
                  type="text"
                  id="charge"
                  className="w-[220px] h-[50px] p-[14px] border-[#dadada] border-[2px] focus:border-[#e40303] focus:border-2 rounded duration-100 transition"
                  placeholder="e.g Rent"
                  value={charge}
                  onChange={(e) => setCharge(e.target.value)}
                  onClick={() => setOpen(false)}
                />

                <span className="input-highlight"></span>
              </div>
              <div className="flex flex-col">
                <div className="relative group">
                  <label htmlFor="charge" className="absolute -top-5 ">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="charge"
                    className="w-[220px] h-[50px] p-[14px] overflow-hidden pl-20 border-[#dadada] border-[2px] focus:border-[#d10303] focus:border-2 rounded duration-100 transition"
                    placeholder="e.g 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onClick={() => setOpen(false)}
                  />
                  <p
                    onClick={() => setOpen(!open)}
                    className="absolute top-0 z-40 p-[14px] cursor-pointer flex items-center font-bold"
                  >
                    <span className="w-[30px]">
                      {" "}
                      {selectedCurrency ? `${currency.symbol}` : `${currency}`}
                    </span>
                    <MdArrowDropDown className="text-[24px]" />
                  </p>
                </div>

                {open && (
                  <ul className="absolute top-[4.2rem] z-[100] w-[220px] h-[200px] overflow-hidden overflow-y-scroll bg-bg_light_var gap-1 cursor-pointer rounded  flex flex-col shadow-fade border-[1px] border-[#dbdbdb]">
                    {currencies.map((currencies, i) => (
                      <li
                        onClick={() => {
                          setCurrency(currencies);
                          setSelectedCurrency(currencies);
                          setOpen(false);
                        }}
                        key={i}
                        className="text-[14px] flex items-center gap-1 font-medium hover:bg-bg_var  px-[14px] py-[7px]"
                      >
                        <input
                          type="checkbox"
                          checked={currencies === selectedCurrency}
                          onChange={() => setSelectedCurrency(currencies)}
                        />
                        <p className="flex items-center gap-2">
                          <span className="font-bold">{currencies.symbol}</span>
                          <span> {currencies.name}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className=" w-full rounded shadow-fade  button"
              >
                <span className="text-[18px] font-bold">
                  {editMode ? "Edit" : "Add"}
                </span>
                <span className="icon">
                  <MdAdd />
                </span>
              </button>
            </div>
          </form>
          <div className="flex flex-col  bg-bg_var  h-[350px] ">
            <div className="flex flex-col p-4">
              {items.length > 0 ? (
                <div>
                  <div className="flex items-center  justify-between rounded  py-2 px-4 bg-bg mx-8 my-4">
                    <p className="font-bold">My list</p>
                    <div className="flex items-center gap-x-4 relative">
                      <p
                        className="bg-bg_light text-[14px] rounded p-2 cursor-pointer"
                        onClick={handleSelectAll}
                      >
                        {selectAll ? (
                          <span onClick={() => setSelectAll(false)}>
                            Unselect All
                          </span>
                        ) : (
                          "Select All"
                        )}
                      </p>
                      <p
                        className="bg-bg_light text-[14px] rounded p-2 cursor-pointer"
                        onClick={handleDelete}
                      >
                        Delete
                      </p>
                      <BsThreeDotsVertical className="text-[1.4rem] cursor-pointer" />
                      {filter && (
                        <div className=" bg-bg_light_var  flex flex-col shadow-fade border-[1px] border-[#dbdbdb] rounded absolute  w-[120px] right-4  z-20">
                          <div className="flex flex-col gap-4 px-2 py-4">
                            <div
                              className="flex flex-col justify-start items-start text-start  text-[14px] gap-[.5rem]"
                              onClick={() => setFilter(false)}
                            >
                              <p className="cursor-pointer hover:bg-bg_var p-[6px] w-full flex justify-between items-center ">
                                <span> All</span>
                                <BsCheck2 className="text-[#079b07] text-[16px]" />
                              </p>
                              <p className="cursor-pointer hover:bg-bg_var p-[6px] w-full flex justify-between items-center ">
                                <span>Time</span>
                                <BsCheck2 className="text-[#079b07] text-[16px]" />
                              </p>
                              <p className="cursor-pointer hover:bg-bg_var p-[6px] w-full flex justify-between items-center ">
                                <span>Date</span>
                                <BsCheck2 className="text-[#079b07] text-[16px]" />
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" flex items-center justify-center">
                  <p className="text-[16px] font-bold">Add a new list!</p>
                </div>
              )}
              <div
                className={`flex  gap-4 flex-col mt-4 p-4 overflow-hidden h-[250px] border-t-[2px] border-[#dadada]  ${
                  items.length > 2 && "overflow-y-scroll border-b-2"
                }`}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex-flex-col relative group transition-all"
                  >
                    <div className="bg-bg px-8  py-2 flex items-center justify-between rounded  border-[#dadada] border-[1px] duration-500 transform group-hover:-translate-y-1 group-hover:shadow-fade g">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-[1.2rem] font-bold">
                          {item.charge}
                        </h4>
                        <h5 className="text-[1.1rem] mt-2 font-medium  text-zinc-600/80">
                          {currency.symbol} {item.amount}
                        </h5>
                        <p className="text-[12px] text-zinc-500">
                          {`${item.date} ${item.month} ${item.time}`}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id
                                ? { ...i, selected: !i.selected }
                                : i
                            )
                          )
                        }
                        className={`text-[1.2rem] cursor-pointer opacity-0 duration-500 group-hover:opacity-100 ${
                          selectAll && "opacity-100"
                        }`}
                      />
                      <div className="absolute top-2 right-8">
                        <BsPencilFill
                          className="text-[1.2rem] cursor-pointer"
                          onClick={() => handleEdit(item.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-[80px] bg-bg_var">
            {items.length > 0 && (
              <div className="flex items-center justify-center text-[16px] pt-4 pb-2">
                <p className="flex items-center gap-2  bg-bg w-full py-4 mx-8 rounded justify-center">
                  <span>Total:</span>
                  <span className="text-[1.2rem] font-bold">{totalAmount}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
