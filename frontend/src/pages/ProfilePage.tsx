import { useEffect, useMemo, useRef, useState } from "react";
import type { Account, Transaction } from "../types";
import apiService from "../services/api.service";
import { DashboardLayout } from "./DashboardLayout";
import { LoadingModelPage } from "./LoadingModelPage";
import { useAuth } from "../hooks/useAuth";

export const ProfilePage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsAll, setAccountsAll] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [senderId, setSenderId] = useState<number | "">("");
  const [receiverId, setReceiverId] = useState<number | "">("");
  const [amount, setAmount] = useState<number>(0);
  const [typeV, setTypeV] = useState<string>("virement");
  const [typeC, setTypeC] = useState<string>("mesComptes");
  const [typeDiv, setTypeDiv] = useState<string>("");

  const [pendingScroll, setPendingScroll] =
    useState<React.RefObject<HTMLDivElement | null> | null>(null);

  const accRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const accountsRef = useRef<HTMLDivElement>(null);
  const accountsAllRef = useRef<HTMLDivElement>(null);
  const transactionVireRef = useRef<HTMLDivElement>(null);
  const transactionDepotRef = useRef<HTMLDivElement>(null);
  const transactionRetraitRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingScroll?.current) {
      pendingScroll.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      handleReset();
      setPendingScroll(null);
    }
  }, [pendingScroll, typeV, typeDiv]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    handleReset();
    if (ref === transactionVireRef) setTypeV("virement");
    if (ref === transactionDepotRef) setTypeV("dépôt");
    if (ref === transactionRetraitRef) setTypeV("retrait");

    if (ref === accountsRef) setTypeC("mesComptes");
    if (ref === accountsAllRef) setTypeC("toutComptes");

    if (ref === profileRef) {
      setTypeDiv("profile");
    } else if (ref === paramsRef) {
      setTypeDiv("params");
    } else {
      setTypeDiv("");
    }

    setPendingScroll(ref);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const accountsData = await apiService.getMyAccounts(user?.idUser);
      const accountsDataAll = await apiService.getAccounts();

      const accountIds = accountsData.map(
        (account: Account) => account.idAccount,
      );

      const transactionsData =
        await apiService.getAllMyTransactions(accountIds);

      setAccounts(accountsData);
      setAccountsAll(accountsDataAll);
      setTransactions(transactionsData);
    } finally {
      setLoading(false);
    }
  };

  const loadNewTransactionData = async () => {
    try {
      const accountsData = await apiService.getMyAccounts(user?.idUser);
      const accountsDataAll = await apiService.getAccounts();

      const accountIds = accountsData.map(
        (account: Account) => account.idAccount,
      );

      const transactionsData =
        await apiService.getAllMyTransactions(accountIds);

      setAccounts(accountsData);
      setAccountsAll(accountsDataAll);
      setTransactions(transactionsData);
      setLoading(false);
    } catch (err: any) {
      if (err.response && err.response.data) {
        console.log("er er === ", err.response.data.message);
      } else {
        console.log("Erreur inconnue");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadNewTransactionDataNoUselessRefresh();
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const loadNewTransactionDataNoUselessRefresh = async () => {
    try {
      const accountsData = await apiService.getMyAccounts(user?.idUser);
      const accountsDataAll = await apiService.getAccounts();

      const accountIds = accountsData.map(
        (account: Account) => account.idAccount,
      );

      const transactionsData =
        await apiService.getAllMyTransactions(accountIds);

      // update seulement si différent
      setAccounts((prev) =>
        JSON.stringify(prev) !== JSON.stringify(accountsData)
          ? accountsData
          : prev,
      );

      setAccountsAll((prev) =>
        JSON.stringify(prev) !== JSON.stringify(accountsDataAll)
          ? accountsDataAll
          : prev,
      );

      setTransactions((prev) =>
        JSON.stringify(prev) !== JSON.stringify(transactionsData)
          ? transactionsData
          : prev,
      );
      setLoading(false);
    } catch (err: any) {
      console.log(err?.response?.data?.message || "Erreur inconnue");
    }
  };

  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
    [accounts],
  );

  const handleTransaction = async () => {
    if (!senderId || !receiverId || amount <= 0) {
      setTransactionStatus("❌ Veuillez remplir tous les champs correctement");
      return;
    }
    if (senderId === receiverId && typeV === "virement") {
      setTransactionStatus("❌ Les comptes doivent être différents");
      return;
    }

    setTransactionStatus("⏳ Transaction en cours...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      await apiService.doTransaction(
        Number(senderId),
        Number(receiverId),
        amount,
        typeV,
      );

      handleReset();
      setPendingScroll(transactionVireRef);
      setTransactionStatus("✅ Transaction effectuée avec succès !");

      setTimeout(() => {
        loadNewTransactionData();
        setTransactionStatus("");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      console.log("error= ", error);

      const backendMessage =
        error?.message || "Erreur lors de la transaction";

      setTransactionStatus(
        `❌ ${backendMessage}`,
      );
    }
  };

  const capitalizeUsername = (username: string | undefined) => {
    if (!username) return "";
    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const formatDateFR = (date?: string) => {
    const value = date ? new Date(date.replace(",", ".")) : new Date();

    return `Le ${value.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}`;
  };
  const handleReset = () => {
    setSenderId("");
    setReceiverId("");
    setAmount(0);
  };

  if (loading) {
    return <LoadingModelPage />;
  }

  return (
    <DashboardLayout
      username={accounts[0]?.owner?.username}
      onLogout={handleLogout}
      scrollToSection={scrollToSection}
      accRef={accRef}
      profileRef={profileRef}
      accountsRef={accountsRef}
      accountsAllRef={accountsAllRef}
      transactionVireRef={transactionVireRef}
      transactionDepotRef={transactionDepotRef}
      transactionRetraitRef={transactionRetraitRef}
      historyRef={historyRef}
      paramsRef={paramsRef}
    >
      <div className="bg-slate-100 p-4 space-y-5">
        {/* HEADER */}
        <div
          ref={accRef}
          className="bg-gradient-to-r from-indigo-500 to-purple-200 text-white rounded-xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-200 mb-2">
                🏦 Mon D.C.B.S{" "}
              </h1>
              <p className="text-gray-300">
                Gérez vos comptes et transactions en toute simplicité
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Solde total</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalBalance.toFixed(2)} Dhs
              </p>
            </div>
          </div>
        </div>

        {/* Profile */}
        {typeDiv === "profile" && (
          <div ref={profileRef} className="bg-white shadow-xl rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* LEFT */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {capitalizeUsername(accounts[0]?.owner?.username)?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {capitalizeUsername(accounts[0]?.owner?.username)}
                  </h2>
                  <p className="text-gray-500">{accounts[0]?.owner?.email}</p>
                  <p className="text-sm text-gray-400">
                    ID Utilisateur: #{accounts[0]?.owner?.idUser}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-2xl text-blue-500">Date d'adhésion</p>
                <p className="text-sm font-bold text-gray-600">
                  {formatDateFR(accounts[0]?.owner?.created_at)}
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
              <div className="bg-indigo-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">Nombre de comptes</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {accounts.length}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">Comptes actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {accounts.filter((a) => a.status).length}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {transactions.length}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition">
                Modifier Profil
              </button>

              <button className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition">
                Changer Mot de Passe
              </button>

              <button className="px-5 py-3 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition">
                Supprimer Compte
              </button>
            </div>
          </div>
        )}

        {/* Comptes */}
        {typeC === "mesComptes" && (
          <div ref={accountsRef} className="bg-white shadow-xl rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-lg p-2 mr-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Mes Comptes Bancaires
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <div
                  key={account.idAccount}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-gray-700">
                      Compte #IDDCBS{account.idAccount}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        account.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {account.status ? "Actif" : "Bloqué"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {account.balance.toFixed(2)} Dhs
                  </p>
                  <p className="text-sm text-gray-600">
                    Type:{" "}
                    <span className="font-semibold">{account.typeCompte}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {typeC === "toutComptes" && (
          <div
            ref={accountsAllRef}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-lg p-2 mr-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Mes Bénéficiaires
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountsAll.map((account) => (
                <div
                  key={account.idAccount}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-gray-700">
                      Compte #IDDCBS{account.idAccount}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        account.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {account.status ? "Actif" : "Bloqué"}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    ****.** Dhs
                  </p>
                  <p className="text-sm text-gray-600">
                    Type:{" "}
                    <span className="font-semibold">{account.typeCompte}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nouvelle Transaction (Virement)*/}
        {typeV === "virement" && (
          <div
            ref={transactionVireRef}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 rounded-lg p-2 mr-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Effectuer une Transaction
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select
                className="border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition"
                value={senderId}
                onChange={(e) =>
                  setSenderId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <option value="">Compte émetteur</option>
                {accounts
                  .filter((acc) => acc.status)
                  .map((acc) => (
                    <option key={acc.idAccount} value={acc.idAccount}>
                      #IDDCBS{acc.idAccount} {" - "}
                      {capitalizeUsername(acc.owner?.username)}
                    </option>
                  ))}
              </select>

              <select
                className="border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition"
                value={receiverId}
                onChange={(e) =>
                  setReceiverId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <option value="">Compte receveur</option>
                {accountsAll
                  .filter((acc) => acc.status)
                  .map((acc) => (
                    <option key={acc.idAccount} value={acc.idAccount}>
                      #IDDCBS{acc.idAccount} {" - "}
                      {capitalizeUsername(acc.owner?.username)}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                step="0.01"
                min="0"
                className="border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition"
                placeholder="Montant (Dhs)"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <button
                onClick={handleTransaction}
                className="bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg p-3 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Envoyer 💸
              </button>
            </div>

            {transactionStatus && (
              <div
                className={`p-4 rounded-lg ${
                  transactionStatus.includes("✅")
                    ? "bg-green-50 text-green-700"
                    : transactionStatus.includes("❌")
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                }`}
              >
                {transactionStatus}
              </div>
            )}
          </div>
        )}

        {/* Nouvelle Transaction (Depot)*/}
        {typeV === "dépôt" && (
          <div
            ref={transactionDepotRef}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-lg p-2 mr-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Dépôt d'argent
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                className="border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition"
                value={receiverId}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setSenderId(value);
                  setReceiverId(value);
                  setTypeV("dépôt");
                }}
              >
                <option value="">Compte à crédité</option>
                {accounts
                  .filter((acc) => acc.status)
                  .map((acc) => (
                    <option key={acc.idAccount} value={acc.idAccount}>
                      #IDDCBS{acc.idAccount} {" - "}
                      {capitalizeUsername(acc.owner?.username)}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                step="0.01"
                min="0"
                className="border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition"
                placeholder="Montant (Dhs)"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <button
                onClick={handleTransaction}
                className="bg-gradient-to-r from-green-300 to-green-400 text-white rounded-lg p-3 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Déposer 💰
              </button>
            </div>

            {transactionStatus && (
              <div
                className={`p-4 rounded-lg ${
                  transactionStatus.includes("✅")
                    ? "bg-green-50 text-green-700"
                    : transactionStatus.includes("❌")
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                }`}
              >
                {transactionStatus}
              </div>
            )}
          </div>
        )}

        {/* Nouvelle Transaction (retrait)*/}
        {typeV === "retrait" && (
          <div
            ref={transactionRetraitRef}
            className="bg-white shadow-xl rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-red-100 rounded-lg p-2 mr-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 12h12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Retrait d'argent
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                className="border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition"
                value={receiverId}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setSenderId(value);
                  setReceiverId(value);
                  setTypeV("retrait");
                }}
              >
                <option value="">Compte à debité</option>
                {accounts
                  .filter((acc) => acc.status)
                  .map((acc) => (
                    <option key={acc.idAccount} value={acc.idAccount}>
                      #IDDCBS{acc.idAccount} {" - "}
                      {capitalizeUsername(acc.owner?.username)}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                step="0.01"
                min="0"
                className="border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition"
                placeholder="Montant (Dhs)"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <button
                onClick={handleTransaction}
                className="bg-gradient-to-r from-red-300 to-pink-400 text-white rounded-lg p-3 font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Retirer 💰
              </button>
            </div>

            {transactionStatus && (
              <div
                className={`p-4 rounded-lg ${
                  transactionStatus.includes("✅")
                    ? "bg-green-50 text-green-700"
                    : transactionStatus.includes("❌")
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                }`}
              >
                {transactionStatus}
              </div>
            )}
          </div>
        )}

        {/* Historique des Transactions */}
        <div ref={historyRef} className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 rounded-lg p-2 mr-3">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Historique des Transactions
            </h2>
          </div>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune transaction pour le moment
              </p>
            ) : (
              transactions.map((t) => (
                <div
                  key={t.idTransaction}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div
                        className={` 
    ${
      t.typeV === "dépôt"
        ? "bg-green-100"
        : t.typeV === "retrait"
          ? "bg-red-100"
          : "bg-blue-100"
    } rounded-full p-2`}
                      >
                        <svg
                          className={`  ${
                            t.typeV === "dépôt"
                              ? "text-green-600"
                              : t.typeV === "retrait"
                                ? "text-red-600"
                                : "text-blue-600"
                          }w-5 h-5`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Transaction en faveur de{" "}
                          <span className="capitalize">
                            {t.receiver?.username}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(t.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          Compte #IDDCBS{t.senderAccountId} → Compte #IDDCBS
                          {t.receiverAccountId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`  ${
                          t.typeV === "dépôt"
                            ? "text-green-600"
                            : t.typeV === "retrait"
                              ? "text-red-600"
                              : "text-blue-600"
                        } text-2xl font-bold`}
                      >
                        {t.amount.toFixed(2)} Dhs
                      </p>
                      <p className="text-xs text-gray-500">
                        Ref: TIDDCBS{t.idTransaction}XZS
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Parametre*/}
        {typeDiv === "params" && (
          <div
            ref={paramsRef}
            className="bg-white shadow-xl rounded-2xl p-8 space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              ⚙️ Paramètres de l'application
            </h2>

            {/* 3 catégories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sécurité */}
              <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  🔐 Sécurité
                </h3>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">
                      Authentification à deux facteurs
                    </p>
                    <p className="text-sm text-gray-500">
                      Ajouter une couche de sécurité supplémentaire
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Notifications de connexion</p>
                    <p className="text-sm text-gray-500">
                      Recevoir un email lors d'une connexion
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>

              {/* Préférences */}
              <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  🎨 Préférences
                </h3>

                <div className="flex items-center justify-between py-3 border-b">
                  <p className="font-medium">Mode sombre</p>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between py-3">
                  <p className="font-medium">Langue</p>
                  <select className="border rounded-lg px-3 py-2">
                    <option>Français</option>
                    <option>English</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div className="border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  🔔 Notifications
                </h3>

                <div className="flex items-center justify-between py-3 border-b">
                  <p className="font-medium">Notifications email</p>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between py-3">
                  <p className="font-medium">Notifications SMS</p>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="border border-red-200 rounded-xl p-6 bg-red-50">
              <h3 className="text-lg font-semibold mb-4 text-red-600">
                Zone dangereuse
              </h3>

              <button className="px-5 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                Réinitialiser l'application
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
