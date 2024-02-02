"use client";

import { useState } from "react";
import { InputBase } from "~~/components/scaffold-eth";

const selectOptions = [0.1, 0.25, 0.5, 1];

const Form = () => {
  const [formState, setFormState] = useState({ title: "", description: "", askAmount: 0.1 });

  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        <h2 className="card-title self-center text-3xl !mb-0">Submit Proposal</h2>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Title</p>
          <InputBase
            placeholder="title"
            value={formState.title}
            onChange={value => setFormState({ ...formState, title: value })}
          />
        </div>
        {/* TODO: Probably we want this to WYSIWYG editor */}
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Description</p>
          <div className="flex border-2 border-base-300 bg-base-200 rounded-3xl text-accent">
            <textarea
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 pt-2 border w-full font-medium placeholder:text-accent/50 text-gray-400 h-28 rounded-none"
              placeholder="description"
              value={formState.description}
              onChange={e => setFormState({ ...formState, description: e.target.value })}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Ask amount</p>
          <select
            className="select bg-base-200 select-primary select-md select-bordered w-full"
            value={formState.askAmount}
            onChange={e => setFormState({ ...formState, askAmount: parseFloat(e.target.value) })}
          >
            <option disabled>Select amount</option>
            {selectOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => console.log(formState)}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Form;
