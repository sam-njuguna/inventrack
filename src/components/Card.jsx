import React, { useState } from "react";
import { MdAdd, MdCheckBoxOutlineBlank } from "react-icons/md";
import { BsCheck2, BsPencilFill, BsThreeDotsVertical } from "react-icons/bs";
const Card = () => {
  const [filter, setFilter] = useState(false);
  const [alert, setAlert] = useState(false);
  const [text, setText] = useState("");
  const [dateTime, setDateTime] = useState("");
  const handleFilter = () => {
    setFilter(!filter);
  };
  const handleAlert = (e) => {
    e.preventDefault();
    setAlert(!alert), setTimeout(() => setAlert(false), 1500);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const formattedDateTime = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
    setDateTime(formattedDateTime);
  };

  return (
    <div className="width flex flex-col justify-center items-center h-screen pt-8">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-[3rem] font-bold">Budget Calculater</h2>
        <div className="bg-white all relative">
          <div className="all">
            {alert && (
              <div className="absolute bottom-4 w-full">
                <div className="h-[40px] bg-bg_light_var ">
                  <h2>Hello</h2>
                </div>
              </div>
            )}
          </div>
          <form
            className="w-full flex flex-col gap-4 px-8 py-4"
            onClick={() => setFilter(false)}
            onSubmit={handleSubmit}
          >
            <div className="flex gap-4">
              <div className="input-container">
                <input
                  placeholder="e.g. rent"
                  className="input-field"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <label for="input-field" className="input-label">
                  Charge
                </label>
                <span className="input-highlight"></span>
              </div>
              <div className="input-container">
                <input
                  placeholder="e.g. 100"
                  className="input-field"
                  type="number"
                />
                <label for="input-field" className="input-label">
                  Amount
                </label>
                <span className="input-highlight"></span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className=" w-full rounded  button"
                onClick={handleAlert}
              >
                <span className="button__text">Add charges</span>
                <span className="icon">
                  <MdAdd />
                </span>
              </button>
            </div>
          </form>
          <div className="flex flex-col  bg-bg_var  h-[350px] ">
            <div className="flex flex-col p-4">
              <div className="flex items-center  justify-between rounded  py-2 px-4 bg-bg mx-8 my-4">
                <p className="font-bold">My list</p>
                <div className="flex items-center gap-x-4 relative">
                  <p className="bg-bg_light text-[14px] rounded p-2 cursor-pointer">
                    Select all
                  </p>
                  <p className="bg-bg_light text-[14px] rounded p-2 cursor-pointer">
                    Delete
                  </p>
                  <BsThreeDotsVertical
                    className="text-[1.4rem] cursor-pointer"
                    onClick={handleFilter}
                  />
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
              <div className="flex  gap-4 flex-col mt-4 p-4 overflow-hidden h-[250px] border-y-[2px] border-[#dadada] overflow-y-scroll">
                <div
                  className="flex-flex-col relative group transition-all"
                  onClick={() => setFilter(false)}
                >
                  <div className="bg-bg px-8  py-2 flex items-center justify-between rounded  border-[#dadada] border-[1px] duration-500 transform group-hover:-translate-y-1 group-hover:shadow-fade g">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[1.4rem] font-medium">Rent</h4>
                      <h5 className="text-[1rem] mt-2  text-zinc-600/80">
                        ksh: 6000
                      </h5>
                      <p className="text-[14px] text-zinc-500">20,march,2022</p>
                    </div>
                    <MdCheckBoxOutlineBlank className="text-[1.2rem] cursor-pointer opacity-0 duration-500 group-hover:opacity-100" />
                    <div className="absolute top-2 right-8">
                      <BsPencilFill className="text-[1.2rem] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center text-[16px] bg-bg_var pt-6 pb-2">
            <p className="flex items-center gap-2  bg-bg shadow-fade w-full py-4 mx-8 rounded justify-center">
              <span>Total:</span>
              <span className="text-[1.2rem] font-bold">1200</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
