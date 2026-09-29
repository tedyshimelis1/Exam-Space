"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TEST_EXAM_ID = "4bb85738-b4ce-4b95-87b7-7aee53631345";

export default function Home() {
  const supabase = createClient();

  const [email, setEmail] = useState("examspace.test@example.com");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function testStartExam() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // ======================================================
      // 1. Sign in the test student
      // ======================================================

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        throw new Error(`Login failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error("Login succeeded but no user was returned.");
      }

      // ======================================================
      // 2. Call start_exam()
      // ======================================================

      const { data, error: examError } = await supabase.rpc("start_exam", {
        p_exam_id: TEST_EXAM_ID,
      });

      if (examError) {
        throw new Error(`start_exam failed: ${examError.message}`);
      }

      // ======================================================
      // 3. Display the result
      // ======================================================

      setResult(
        JSON.stringify(
          {
            authenticated_user: {
              id: authData.user.id,
              email: authData.user.email,
            },
            start_exam_result: data,
          },
          null,
          2,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError(`Logout failed: ${logoutError.message}`);
      return;
    }

    setResult(null);
    setError(null);
  }

  (async () => {
    const { data, error } = await supabase.rpc("submit_exam", {
      p_attempt_id: "e525246f-81be-49db-a921-34428ab3dab6",
    });

    console.log("second submit data:", data);
    console.log("second submit error:", error);
  })();
  /* 
//To start new attempt
(async () => {
  const { data: startData, error: startError } =
    await supabase.rpc("start_exam", {
      p_exam_id: "4bb85738-b4ce-4b95-87b7-7aee53631345",
    });

  console.log("NEW START DATA:", startData);
  console.log("NEW START ERROR:", startError);
})();


  (async () => {
    const { data: changedAnswer, error: changeError } = await supabase.rpc(
      "save_answer",
      {
        p_attempt_id: "2258a16f-a518-4245-b171-8ecfe8f14a55",
        p_question_id: "24c01c6c-38b0-4f3a-b084-2fa056220d5b",
        p_question_version_id: "fc12eaf9-d687-45a7-9687-21e459bc4e61",
        p_selected_option_id: "76a081ca-d69b-4909-8ec7-4fa66ecdcdea",
      },
    );

    console.log("changedAnswer:", changedAnswer);
    console.log("changeError:", changeError);
  })();

(async () => {
  const attemptId = "PASTE_NEW_ATTEMPT_ID_HERE";

  const { data: saveData, error: saveError } =
    await supabase.rpc("save_answer", {
      p_attempt_id: attemptId,
      p_question_id: "24c01c6c-38b0-4f3a-b084-2fa056220d5b",
      p_question_version_id: "fc12eaf9-d687-45a7-9687-21e459bc4e61",
      p_selected_option_id: "a546a042-91d7-4427-8c75-d467ae3d202d",
    });

  console.log("Q1 SAVE DATA:", saveData);
  console.log("Q1 SAVE ERROR:", saveError);
})(); 



 (async () => {
    const { data: answerData, error: answerError } = await supabase.rpc(
      "save_answer",
      {
        p_attempt_id: "b7d3cb6e-707f-475d-bb86-1ca279128097",
        p_question_id: "24c01c6c-38b0-4f3a-b084-2fa056220d5b",
        p_question_version_id: "fc12eaf9-d687-45a7-9687-21e459bc4e61",
        p_selected_option_id: "a546a042-91d7-4427-8c75-d467ae3d202d",
      },
    );

    console.log("answerData:", answerData);
    console.log("answerError:", answerError);
  })();
  
  */

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>ExamSpace V1 — Database Test</h1>

      <p>
        Temporary development page for testing Supabase authentication and{" "}
        <code>start_exam()</code>.
      </p>

      {/* =====================================================
          Login/Test Form
          ===================================================== */}

      <div style={{ marginTop: "30px" }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <label
          htmlFor="password"
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
          }}
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="button"
          onClick={testStartExam}
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
        >
          {loading ? "Testing..." : "Login & Start Test Exam"}
        </button>

        <button
          type="button"
          onClick={logout}
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* =====================================================
          Error
          ===================================================== */}

      {error && (
        <pre
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#fee",
            border: "1px solid #f00",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </pre>
      )}

      {/* =====================================================
          Successful Result
          ===================================================== */}

      {result && (
        <pre
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#efe",
            border: "1px solid #0a0",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}
