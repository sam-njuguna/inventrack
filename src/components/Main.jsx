import React, { useState, useEffect } from "react";
import { BsCheck2, BsPencilFill, BsThreeDotsVertical } from "react-icons/bs";
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineLibraryAdd,
} from "react-icons/md";
import {
  MdAdd,
  MdAddTask,
  MdArrowDropDown,
  MdCheck,
  MdDelete,
  MdDoneAll,
  MdEdit,
  MdWarning,
} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

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
  const [clicked, setClicked] = useState(false);

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
        handleAlert({
          type: "add",
          text: (
            <span className="flex items-center gap-2">
              <MdCheck className="text-[1.6rem]" />
              <span>Item was edited.</span>
            </span>
          ),
        });
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
        if (!clicked) {
          setItems([newItem, ...items]);
        } else {
          setItems([...items, newItem]);
        }
        handleAlert({
          type: "add",
          text: (
            <span className="flex items-center gap-2">
              <MdAddTask className="text-[1.6rem]" />
              <span>A new tem was added.</span>
            </span>
          ),
        });
      }
      setCharge("");
      setAmount("");
    }
    setTotalAmount(calculateTotalAmount(items));
  };

  const handleDelete = () => {
    // Check if any items are selected
    const selectedItems = items.filter((item) => item.selected);
    const numSelectedItems = selectedItems.length;

    if (numSelectedItems === 0) {
      // If no items are selected, show an alert and exit the function
      handleAlert({
        type: "select",

        text: (
          <span className="flex items-center gap-2">
            <MdWarning className="text-[1.6rem]" />
            <span>Select at least one item to delete.</span>
          </span>
        ),
      });
      return;
    }

    // If at least one item is selected, proceed with deletion
    const newItems = items.filter((item) => !item.selected);
    setItems(newItems);
    setSelectAll(false);
    setTotalAmount(calculateTotalAmount(newItems));

    const message = numSelectedItems === 1 ? "item" : "items";
    handleAlert({
      type: "delete",
      text: (
        <span className="flex items-center gap-2">
          <MdDelete className="text-[1.6rem]" />
          <span> {`${numSelectedItems} ${message} deleted!`}</span>
        </span>
      ),
    });
  };

  const handleItemSelect = (itemId) => {
    // A new array of items is created using map function, where the selected property of the item with a particular id is toggled.
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );
    // The state of items is updated with the newItems array.
    setItems(newItems);

    // The number of items selected is calculated by filtering the newItems array where the selected property is true.
    const numSelected = newItems.filter((item) => item.selected).length;
    // The appropriate grammar for item or items is determined based on whether one or
    const itemOrItems = numSelected === 1 ? "item" : "items";
    const icons = numSelected === 1 ? <MdCheck /> : <MdDoneAll />;

    handleAlert({
      type: "select",

      text: (
        <span className="flex items-center gap-2">
          <span className="text-[1.6rem]">{icons}</span>
          {`${numSelected} ${itemOrItems} selected on your list.`}
        </span>
      ),
    });
  };

  const handleSelectAll = () => {
    const newItems = items.map((item) => ({ ...item, selected: !selectAll }));
    setItems(newItems);
    setSelectAll(!selectAll);

    const numSelected = newItems.filter((item) => item.selected).length;
    const itemOrItems = numSelected === 0 ? "item" : "items";
    const icons = numSelected === 0 ? <MdCheck /> : <MdDoneAll />;
    handleAlert({
      type: "select",
      text: (
        <span className="flex items-center gap-2">
          <span className="text-[1.6rem]">{icons}</span>
          <span> {`${numSelected} ${itemOrItems} selected on your list.`}</span>
        </span>
      ),
    });
  };

  const handleEdit = (id) => {
    if (!editMode) {
      setEditMode(true);
      setEditId(id);
      const itemToEdit = items.find((item) => item.id === id);
      setCharge(itemToEdit.charge);
      setAmount(itemToEdit.amount);
      handleAlert({
        type: "edit",
        text: (
          <span className="flex items-center gap-2">
            <MdEdit className="text-[1.6rem]" />
            <span>{"You are editing the item."}</span>
          </span>
        ),
      });
    }
  };

  const handleAlert = ({ type, text }) => {
    // Update the state of showAlert to show the alert with the given type and text.
    setShowAlert({ show: true, type, text });
    // Set a timeout to hide the alert after 2 seconds (2000 milliseconds).
    setTimeout(() => {
      setShowAlert({ show: false });
    }, 3000);
  };

  //fiter by new and old items;
  const handleOld = () => {
    if (!clicked) {
      setItems([...items.reverse()]);
      setClicked(true);
      handleAlert({
        type: "info-alert",
        text: (
          <span className="flex items-center gap-2">
            <MdOutlineKeyboardDoubleArrowDown className="text-[1.6rem]" />
            <span>Arranged items starting with old ones.</span>
          </span>
        ),
      });
    } else {
      setItems([...items.reverse()]);
      setClicked(false);
      handleAlert({
        type: "info-alert",
        text: (
          <span className="flex items-center gap-2">
            <MdOutlineKeyboardDoubleArrowDown className="text-[1.6rem]" />
            <span>Arranged items starting with new ones.</span>
          </span>
        ),
      });
    }
  };

  return (
    <div className="width flex flex-col justify-center items-center min-h-screen pt-8">
      <div className="flex flex-col justify-center items-center gap-8 all ">
        <h2 className="text-[3rem] font-bold max-mobile:text-[2rem] max-mobile:my-4">
          Budget Calculater
        </h2>
        <div className="bg-white all relative">
          {showAlert && (
            <div className="alert">
              <div className="fixed bottom-4 left-0 w-full z-20">
                <div
                  className={`h-[80px] text-center rounded mx-8 max-mobile:mx-4 flex justify-center items-center ${
                    showAlert.text ? `${showAlert.type}` : ""
                  }`}
                >
                  <p
                    className={` flex items-center gap-2${
                      showAlert.text ? `` : "opacity-0"
                    }`}
                  >
                    <span> {showAlert.text}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 px-2 py-4"
          >
            <div className="flex items-center max-mobile:flex-col max-mobile:w-full max-mobile:gap-y-8 gap-x-4">
              <div className="relative">
                <label htmlFor="charge" className="absolute -top-6 left-2">
                  Charge
                </label>
                <input
                  type="text"
                  id="charge"
                  required
                  className="w-[220px] max-mobile:w-[270px] h-[50px] p-[14px] border-[#dadada] border-[2px] focus:border-[#e40303] focus:border-2 rounded duration-100 transition"
                  placeholder="e.g Rent"
                  value={charge}
                  onChange={(e) => setCharge(e.target.value)}
                  onClick={() => {
                    setOpen(false);
                    setFilter(false);
                  }}
                />

                <span className="input-highlight"></span>
              </div>
              <div className="flex flex-col">
                <div className="relative group">
                  <label htmlFor="charge" className="absolute -top-6 left-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="charge"
                    required
                    className="w-[220px] max-mobile:w-[270px] h-[50px] p-[14px] overflow-hidden pl-20 border-[#dadada] border-[2px] focus:border-[#d10303] focus:border-2 rounded duration-100 transition"
                    placeholder="e.g 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onClick={() => {
                      setOpen(false);
                      setFilter(false);
                    }}
                  />
                  <p
                    onClick={() => setOpen(!open)}
                    className="absolute top-0 z-40 p-[14px] cursor-pointer flex items-center font-bold"
                  >
                    <span className="w-[30px]">
                      {selectedCurrency ? `${currency.symbol}` : `${currency}`}
                    </span>
                    <MdArrowDropDown className="text-[24px]" />
                  </p>
                </div>

                {open && (
                  <ul className="absolute top-[4.2rem] max-mobile:top-[9.5rem] z-[100] w-[220px] h-[200px] overflow-hidden overflow-y-scroll bg-bg_light_var gap-1 cursor-pointer rounded  flex flex-col shadow-fade border-[1px] border-[#dbdbdb]">
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
          <div className="flex flex-col  bg-bg_var w-full  h-[350px]  max-tablet:mt-8">
            {items.length > 0 ? (
              <div className="flex flex-col p-4">
                <div>
                  <div className="flex items-center  justify-between rounded  py-2 px-4 bg-bg mx-8 max-mobile:mx-0 my-4">
                    <p className="font-bold">My list</p>
                    <div className="flex items-center gap-x-4 relative">
                      <p
                        className="bg-bg_light text-[14px] rounded p-2 cursor-pointer duration-100 ease-out hover:bg-bg_var"
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
                        className="bg-bg_light text-[14px] rounded p-2 cursor-pointer duration-100 ease-out hover:bg-bg_var"
                        onClick={handleDelete}
                      >
                        Delete
                      </p>
                      <BsThreeDotsVertical
                        className="text-[1.4rem] cursor-pointer"
                        onClick={() => setFilter(!filter)}
                      />
                      {filter && (
                        <div className=" bg-bg_light_var  flex flex-col shadow-fade border-[1px] border-[#dbdbdb] rounded absolute  w-[120px] right-4  z-20">
                          <div className="flex flex-col gap-4 ">
                            <div
                              className="flex flex-col justify-start items-start text-start  text-[14px]"
                              onClick={() => setFilter(false)}
                            >
                              <p className=" px-2 py-4">
                                <span>Start with,</span>
                              </p>
                              <p
                                className="cursor-pointer hover:bg-bg_var p-[6px] w-full font-medium  px-2 py-2 mb-2"
                                onClick={handleOld}
                              >
                                {clicked ? "new ?" : "Old ?"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex  gap-4 flex-col mt-4  p-4 max-mobile:px-0 overflow-hidden h-[250px] border-t-[2px] border-[#dadada]  ${
                    items.length > 2 && "overflow-y-scroll border-b-2"
                  }`}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex-flex-col relative group transition-all"
                      onClick={() => setFilter(false)}
                    >
                      <div className="bg-bg px-8 max-mobile:px-4 py-2 flex items-center justify-between rounded  border-[#dadada] border-[1px] duration-500 transform group-hover:-translate-y-1 max-mobile:group-hover:translate-y-0 group-hover:shadow-fade  ">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-[1.2rem] max-mobile:text-[1rem] font-bold">
                            {item.charge}
                          </h4>
                          <h5 className="text-[1rem] max-mobile:text-[.9rem]  mt-2 font-medium flex gap-2 items-center text-zinc-600/80">
                            <span className="font-bold">
                              {selectedCurrency
                                ? `${currency.symbol}`
                                : `${currency}`}
                            </span>
                            <span> {item.amount}</span>
                          </h5>
                          <p className="text-[12px] text-zinc-500">
                            {`${item.date} ${item.month} ${item.time}`}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={item.selected}
                          onClick={() => setSelectAll(true)}
                          onChange={() => handleItemSelect(item.id)}
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
            ) : (
              <div className=" flex items-center justify-center text-center  h-[350px]">
                <p className="text-[16px] font-bold flex flex-col items-center justify-center">
                  <span> Add a new list!</span>
                  <span className="text-[3rem]">
                    <MdOutlineLibraryAdd />
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="h-[80px] bg-bg_var">
            {items.length > 0 && (
              <div className="flex items-center justify-center text-[16px] pt-4 pb-2">
                <p className="flex items-center gap-2  bg-bg w-full py-4 mx-8 max-mobile:mx-4 rounded justify-center">
                  <span>Total:</span>
                  <span className="text-[1.1rem] flex gap-2 font-bold">
                    <span>
                      {selectedCurrency ? `${currency.symbol}` : `${currency}`}
                    </span>
                    <span> {totalAmount}</span>
                  </span>
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
