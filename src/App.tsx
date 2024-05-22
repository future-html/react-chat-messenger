import React, { useState } from "react";

const App = () => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<{ messageChat: ""; timeStamp: ""; date: ""; isUserSend: boolean }[]>([]);
	const [simulateIndex, setSimulateIndex] = useState<number>(0);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessages((prev) => {
			return [
				...prev,
				{
					messageChat: message,
					timeStamp: new Date().toLocaleTimeString(),
					date: new Date().toLocaleDateString(),
					isUserSend: simulateIndex % 2 === 0 ? false : true,
				},
			];
		});
		setMessage("");
		setSimulateIndex((prev) => {
			return prev + 1;
		});
	};
	return (
		<div className="min-h-screen bg-gray-100  flex items-center justify-center">
			<div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
				<h1 className="text-xl font-bold mb-4">React Chat</h1>
				<div className="mb-4">
					<div className="h-64 overflow-y-scroll bg-gray-200 p-4 rounded  ">
						{messages.map((each, index) => {
							return (
								<div
									className={` mb-2 flex`}
									key={JSON.stringify(each) + index}
								>
									{each.isUserSend && <div className=" w-1/5"></div>}

									<div className="w-full">
										<div
											className={
												each.isUserSend
													? "bg-blue-500 text-white p-2 rounded "
													: "bg-gray-500 text-white p-2 rounded "
											}
										>
											{each.messageChat}
										</div>
										<h1 className={each.isUserSend ? "text-normal text-end text-gray-400" : "hidden"}>
											sent in {each.date} at {each.timeStamp}
										</h1>
									</div>
									{!each.isUserSend && <div className=" w-1/5"></div>}
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<form
				action=""
				className="flex"
				onSubmit={handleSubmit}
			>
				<input
					type="text"
					placeholder="type your message"
					className="flex-grow p-2 border rounded-l"
					name="message"
					value={message}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setMessage(e.target.value);
					}}
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white p-2 rounded-r"
				>
					Send
				</button>
			</form>
		</div>
	);
};

export default App;
