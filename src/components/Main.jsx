import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import {
  BsDiscord,
  BsGithub,
  BsPencilFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import {
  MdAdd,
  MdAddTask,
  MdArrowDropDown,
  MdCheck,
  MdDelete,
  MdDoneAll,
  MdEdit,
  MdWarning,
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineLibraryAdd,
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
  const containerRef = useRef(null);

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
              <span>A new tem was added in the list.</span>
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
    setItems(newItems);
    const numSelected = newItems.filter((item) => item.selected).length;
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

    const numSelected = newItems.filter((item) => item.selected).length;
    const itemOrItems = numSelected === 0 ? "item" : "items";
    const icons = numSelected === 0 ? <MdCheck /> : <MdDoneAll />;
    if (numSelected > 0) {
      setSelectAll(!selectAll);
    } else {
      setSelectAll(false);
    }

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
      handleSelectAll(true);
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
    setShowAlert({ show: true, type, text });
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

  const handleSelect = (sel) => {
    if (sel === true) {
      setSelectAll(true);
    }
    return setSelectAll(false);
  };
  // To close when its open and outside is clicked
  const handleOutsideClick = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div className="width relative flex flex-col justify-center items-center min-h-[90vh] pt-8 ">
      <motion.div
        initial={{ opacity: 0, y: "20%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="flex flex-col justify-center items-center  width pt-[4rem] max-mobile:pt-24 "
      >
        <div className="all ">
          <p className="mb-8">
            Manage inventory: add, edit, filter, delete items, track budget with
            InvenTrack web app.
          </p>
        </div>

        <div className="all">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 px-2 py-4"
          >
            <div className="flex items-center max-mobile_lg:flex-col w-full max-mobile_lg:gap-y-10 gap-x-4">
              <div className="relative w-full">
                <label htmlFor="charge" className="absolute -top-6 left-2">
                  Charge
                </label>
                <input
                  type="text"
                  id="charge"
                  autoComplete="text"
                  autoCorrect=""
                  required
                  className="w-full h-[50px] p-[14px] border-[#dadada] border-[2px] focus:border-[#4e00cc] focus:border-2 rounded duration-100 transition"
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
              <div className="flex flex-col w-full" ref={containerRef}>
                <div className="relative group">
                  <label htmlFor="charge" className="absolute -top-6 left-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="charge"
                    required
                    className="w-full h-[50px] p-[14px] overflow-hidden pl-20 border-[#dadada] border-[2px] focus:border-[#4e00cc] focus:border-2 rounded duration-100 transition"
                    placeholder="e.g 100"
                    autoComplete="number"
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
                  <ul className="absolute top-[4.2rem] max-mobile:top-[10rem] z-[100] w-[220px] h-[200px] overflow-hidden overflow-y-scroll bg-bg_light_var gap-1 cursor-pointer rounded  flex flex-col shadow-fade border-[1px] border-[#dbdbdb]">
                    {currencies.map((currencies, i) => (
                      <li
                        onClick={() => {
                          setCurrency(currencies);
                          setSelectedCurrency(currencies);
                          setOpen(false);
                        }}
                        key={i}
                        className="text-[14px] flex items-center gap-2 font-medium hover:bg-bg_var  p-[14px] "
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
            <div className="flex items-center max-mobile:w-full  justify-center">
              <button
                type="submit"
                className=" w-full rounded shadow-fade my-2 button"
              >
                <span className="text-[16px]">{editMode ? "Edit" : "Add"}</span>
                <span className="icon">
                  <MdAdd />
                </span>
              </button>
            </div>
          </form>
          <div className="flex flex-col bg-bg_var  min-h-[400px] w-full  max-tablet:mt-8">
            {items.length > 0 ? (
              <div className="flex flex-col p-2">
                <div>
                  <div className="flex items-center  justify-between rounded  py-2 px-4 bg-bg mx-2 max-mobile:mx-0 my-2">
                    <p className="font-bold max-mobile:text-[14px] max-mobile_small:hidden ">
                      My list
                    </p>
                    <div className="flex items-center gap-x-4 relative">
                      <p
                        className="bg-bg_light text-[14px] max-mobile:text-[12px] rounded p-2 cursor-pointer duration-100 ease-out hover:bg-bg_var"
                        onClick={handleSelectAll}
                      >
                        {selectAll > 0 ? (
                          <span onClick={() => setSelectAll(false)}>
                            Unselect All
                          </span>
                        ) : (
                          "Select All"
                        )}
                      </p>
                      <p
                        className="bg-bg_light text-[14px] max-mobile:text-[12px]  rounded p-2 cursor-pointer duration-100 ease-out hover:bg-bg_var"
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
                  className={`flex  gap-4 flex-col mt-4  p-4 max-mobile:px-1 overflow-hidden h-[230px] max-mobile:h-[320px] border-t-[2px] border-[#dadada]  ${
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
                          onClick={handleSelect}
                          onChange={() => handleItemSelect(item.id)}
                          className={`text-[1.2rem] cursor-pointer opacity-0 duration-500 group-hover:opacity-100 ${
                            selectAll && "opacity-100"
                          }`}
                        />

                        <div className="absolute top-2 right-8 max-mobile:right-4">
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
              <div className=" flex items-center justify-center text-center  h-[400px]">
                <p className="text-[16px] font-bold flex flex-col items-center justify-center">
                  <span> Add a new list!</span>
                  <span className="text-[3rem]">
                    <MdOutlineLibraryAdd />
                  </span>
                </p>
              </div>
            )}
            <div className="relative">
              {items.length > 0 && (
                <div className="flex items-center justify-center text-[16px]  pb-2">
                  <p className="flex items-center gap-2  bg-bg w-full py-4 mx-8 max-mobile:mx-4 rounded justify-center">
                    <span>Total:</span>
                    <span className="text-[1.1rem] flex gap-2 font-bold">
                      <span>
                        {selectedCurrency
                          ? `${currency.symbol}`
                          : `${currency}`}
                      </span>
                      <span> {totalAmount}</span>
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <div className="fixed w-full top-0">
        <div className="width max-mobile:border-[#dadada] max-mobile:border-b-[1px]">
          <div className="flex items-center justify-between max-mobile:bg-bg_light_var py-2 ">
            <img src="./bg.webp" alt="" className="w-[130px]" />

            <div className="flex flex-col gap-2">
              <ul className="flex gap-4">
                <li>
                  <a
                    href="https://www.linkedin.com/in/sam-nj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[1.2rem] duration-200 ease-out hover:text-[#3c019c]"
                  >
                    <FaLinkedinIn />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/sam-njuguna"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[1.2rem] duration-200 ease-out hover:text-[#3c019c]"
                  >
                    <BsGithub />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <div className="fixed bottom-4 left-0 w-full">
          <div className=" all-alert">
            <div
              className={`h-[80px] text-center rounded  sm:w-[70%] max-mobile:w-full m-auto flex justify-center items-center  ${
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
    </div>
  );
}

export default App;
