import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Connect Wallet</span>
              </a>
            </li>
            <li>
              <a
                href="/send-transaction"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Send Transaction</span>
              </a>
            </li>
            <li>
              <a
                href="/contact-write"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Contact Write</span>
              </a>
            </li>
            <li>
              <a
                href="/sign-message"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Sign Message</span>
              </a>
            </li>
            <li>
              <a
                href="/siwe"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ml-3">Sign In With Etherium</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <div className="p-4 sm:ml-64 h-screen relative">
        <div className="absolute  w-fit flex flex-col items-center gap-2 top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
