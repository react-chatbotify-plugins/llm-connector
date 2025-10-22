import { useCallback as O, useRef as S, useEffect as z } from "react";
import { useOnRcbEvent as C, RcbEvent as T, useFlow as G, useAudio as L, useMessages as N, usePaths as K, useTextArea as J, useChatWindow as Y } from "react-chatbotify";
const H = {
  autoConfig: !0
}, q = (i, e) => {
  const t = O(
    (s) => {
      const r = i()[s.data.nextPath];
      e(r);
    },
    [i, e]
  );
  C(T.CHANGE_PATH, t);
}, V = (i, e) => {
  const { outputTypeRef: t } = i, {
    toggleTextAreaDisabled: s,
    toggleIsBotTyping: n,
    focusTextArea: r,
    injectMessage: o,
    simulateStreamMessage: a,
    getIsChatBotVisible: d
  } = e, c = O(
    (l) => {
      var p;
      const u = l.data.block;
      u.llmConnector && (l.preventDefault(), l.type === "rcb-pre-process-block" && ((p = u.llmConnector) != null && p.initialMessage && (t.current === "full" ? o(i.initialMessageRef.current) : a(i.initialMessageRef.current)), n(!1), s(!1), setTimeout(() => {
        d() && r();
      })));
    },
    [n, s, r, d]
  );
  C(T.PRE_PROCESS_BLOCK, c), C(T.POST_PROCESS_BLOCK, c);
}, Q = async function* (i, e) {
  for await (const t of i)
    for (const s of t)
      yield s, await new Promise((n) => setTimeout(n, e));
}, X = async function* (i, e) {
  for await (const t of i)
    yield t, await new Promise((s) => setTimeout(s, e));
}, Z = async function* (i, e, t) {
  e === "character" ? yield* Q(i, t) : yield* X(i, t);
}, ee = async function* (i, e) {
  for await (const t of i)
    e(t), yield t;
}, te = async (i, e, t, s = {}) => {
  var M, y;
  if (!e.providerRef.current)
    return;
  const {
    speakAudio: n,
    toggleIsBotTyping: r,
    toggleTextAreaDisabled: o,
    focusTextArea: a,
    injectMessage: d,
    streamMessage: c,
    endStreamMessage: l,
    getIsChatBotVisible: u
  } = t, p = e.providerRef.current.sendMessages(i), f = e.outputTypeRef.current, g = e.outputSpeedRef.current;
  if (f === "full") {
    let h = "";
    for await (const m of p) {
      if ((M = s.signal) != null && M.aborted) break;
      h += m;
    }
    r(!1), d(h), setTimeout(() => {
      o(!1), u() && a();
    });
  } else {
    const h = Z(ee(p, n), f, g);
    let m = "", b = !1;
    for await (const E of h) {
      if ((y = s.signal) != null && y.aborted)
        break;
      b || (r(!1), b = !0), m += E, c(m);
    }
    l(), setTimeout(() => {
      o(!1), u() && a();
    });
  }
}, se = 500, re = (i, e) => {
  const { messagesRef: t, outputTypeRef: s, onUserMessageRef: n, onKeyDownRef: r, errorMessageRef: o } = i, {
    injectMessage: a,
    simulateStreamMessage: d,
    toggleTextAreaDisabled: c,
    toggleIsBotTyping: l,
    goToPath: u,
    focusTextArea: p,
    getIsChatBotVisible: f
  } = e, g = S(null), M = O(
    (y) => {
      if (!i.providerRef.current)
        return;
      const h = y.data.message, m = h.sender.toUpperCase();
      h.tags = h.tags ?? [], h.tags.push(`rcb-llm-connector-plugin:${m}`), m === "USER" && (l(!0), c(!0), setTimeout(async () => {
        var v;
        if (n.current) {
          const R = await n.current(h);
          if (R)
            return (v = g.current) == null || v.abort(), g.current = null, u(R);
        }
        const b = i.historySizeRef.current, E = t.current, x = b ? [...E.slice(-(b - 1)), h] : [h], P = new AbortController();
        g.current = P, te(x, i, e, { signal: P.signal }).catch((R) => {
          l(!1), c(!1), setTimeout(() => {
            f() && p();
          }), console.error("LLM prompt failed", R), s.current === "full" ? a(o.current) : d(o.current);
        });
      }, se));
    },
    [i, e]
  );
  C(T.POST_INJECT_MESSAGE, M), C(T.STOP_SIMULATE_STREAM_MESSAGE, M), C(T.STOP_STREAM_MESSAGE, M), z(() => {
    const y = async (h) => {
      var m;
      if (r.current) {
        const b = await r.current(h);
        b && ((m = g.current) == null || m.abort(), g.current = null, u(b));
      }
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, []);
}, oe = (i) => {
  const e = S([]), t = S(null), s = S("chunk"), n = S(30), r = S(0), o = S(""), a = S("Unable to get response, please try again."), d = S(null), c = S(null), { getFlow: l } = G(), { speakAudio: u } = L(), { messages: p, injectMessage: f, simulateStreamMessage: g, streamMessage: M, endStreamMessage: y } = N(), { goToPath: h } = K(), { toggleTextAreaDisabled: m, focusTextArea: b } = J(), { toggleIsBotTyping: E, getIsChatBotVisible: x } = Y(), P = { ...H, ...i ?? {} };
  z(() => {
    e.current = p;
  }, [p]), q(l, (w) => {
    var k, B, U, F, I, W, D, $, j, _;
    t.current = ((k = w.llmConnector) == null ? void 0 : k.provider) ?? null, s.current = ((B = w.llmConnector) == null ? void 0 : B.outputType) ?? "chunk", n.current = ((U = w.llmConnector) == null ? void 0 : U.outputSpeed) ?? 30, r.current = ((F = w.llmConnector) == null ? void 0 : F.historySize) ?? 0, o.current = ((I = w.llmConnector) == null ? void 0 : I.initialMessage) ?? "", a.current = ((W = w.llmConnector) == null ? void 0 : W.errorMessage) ?? "Unable to get response, please try again.", d.current = (($ = (D = w.llmConnector) == null ? void 0 : D.stopConditions) == null ? void 0 : $.onUserMessage) ?? null, c.current = ((_ = (j = w.llmConnector) == null ? void 0 : j.stopConditions) == null ? void 0 : _.onKeyDown) ?? null;
  });
  const v = {
    providerRef: t,
    messagesRef: e,
    outputTypeRef: s,
    outputSpeedRef: n,
    historySizeRef: r,
    initialMessageRef: o,
    errorMessageRef: a,
    onUserMessageRef: d,
    onKeyDownRef: c
  }, R = {
    speakAudio: u,
    injectMessage: f,
    simulateStreamMessage: g,
    streamMessage: M,
    endStreamMessage: y,
    toggleTextAreaDisabled: m,
    toggleIsBotTyping: E,
    focusTextArea: b,
    goToPath: h,
    getIsChatBotVisible: x
  };
  V(v, R), re(v, R);
  const A = { name: "@rcb-plugins/llm-connector" };
  return P != null && P.autoConfig && (A.settings = {
    event: {
      rcbChangePath: !0,
      rcbPostInjectMessage: !0,
      rcbStopSimulateStreamMessage: !0,
      rcbStopStreamMessage: !0,
      rcbPreProcessBlock: !0,
      rcbPostProcessBlock: !0
    }
  }), A;
}, ie = (i) => () => oe(i);
class ce {
  /**
   * Sets default values for the provider based on given configuration. Configuration guide here:
   * https://github.com/React-ChatBotify-Plugins/llm-connector/blob/main/docs/providers/Gemini.md
   *
   * @param config configuration for setup
   */
  constructor(e) {
    this.debug = !1, this.roleMap = (s) => {
      switch (s) {
        case "USER":
          return "user";
        default:
          return "model";
      }
    }, this.constructBodyWithMessages = (s) => {
      let n;
      return this.messageParser ? n = this.messageParser(s) : n = s.filter(
        (o) => typeof o.content == "string" && o.sender.toUpperCase() !== "SYSTEM"
      ).map((o) => {
        const a = this.roleMap(o.sender.toUpperCase()), d = o.content;
        return {
          role: a,
          parts: [{ text: d }]
        };
      }), this.systemMessage && (n = [{ role: "user", parts: [{ text: this.systemMessage }] }, ...n]), {
        contents: n,
        ...this.body
      };
    }, this.handleStreamResponse = async function* (s) {
      var o, a, d, c, l;
      const n = new TextDecoder("utf-8");
      let r = "";
      for (; ; ) {
        const { value: u, done: p } = await s.read();
        if (p) break;
        r += n.decode(u, { stream: !0 });
        const f = r.split(`
`);
        r = f.pop();
        for (const g of f) {
          const M = g.trim();
          if (!M.startsWith("data: ")) continue;
          const y = M.slice(6);
          try {
            const m = (l = (c = (d = (a = (o = JSON.parse(y).candidates) == null ? void 0 : o[0]) == null ? void 0 : a.content) == null ? void 0 : d.parts) == null ? void 0 : c[0]) == null ? void 0 : l.text;
            m && (yield m);
          } catch (h) {
            console.error("SSE JSON parse error:", y, h);
          }
        }
      }
    }, this.method = e.method ?? "POST", this.body = e.body ?? {}, this.systemMessage = e.systemMessage, this.responseFormat = e.responseFormat ?? "stream", this.messageParser = e.messageParser, this.debug = e.debug ?? !1, this.headers = {
      "Content-Type": "application/json",
      Accept: this.responseFormat === "stream" ? "text/event-stream" : "application/json",
      ...e.headers
    };
    const t = e.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta";
    if (e.mode === "direct")
      this.endpoint = this.responseFormat === "stream" ? `${t}/models/${e.model}:streamGenerateContent?alt=sse&key=${e.apiKey || ""}` : `${t}/models/${e.model}:generateContent?key=${e.apiKey || ""}`;
    else if (e.mode === "proxy")
      this.endpoint = `${t}/${e.model}`;
    else
      throw Error("Invalid mode specified for Gemini provider ('direct' or 'proxy').");
  }
  /**
   * Calls Gemini and yields each chunk (or the full text).
   *
   * @param messages messages to include in the request
   */
  async *sendMessages(e) {
    var s, n, r, o, a;
    if (this.debug) {
      const d = this.endpoint.replace(/\?key=([^&]+)/, "?key=[REDACTED]"), c = { ...this.headers };
      console.log("[GeminiProvider] Request:", {
        method: this.method,
        endpoint: d,
        headers: c,
        body: this.constructBodyWithMessages(e)
      });
    }
    const t = await fetch(this.endpoint, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.constructBodyWithMessages(e))
    });
    if (this.debug && console.log("[GeminiProvider] Response status:", t.status), !t.ok)
      throw new Error(`Gemini API error ${t.status}: ${await t.text()}`);
    if (this.responseFormat === "stream") {
      if (!t.body)
        throw new Error("Response body is empty – cannot stream");
      const d = t.body.getReader();
      for await (const c of this.handleStreamResponse(d))
        yield c;
    } else {
      const d = await t.json();
      this.debug && console.log("[GeminiProvider] Response body:", d);
      const c = (a = (o = (r = (n = (s = d.candidates) == null ? void 0 : s[0]) == null ? void 0 : n.content) == null ? void 0 : r.parts) == null ? void 0 : o[0]) == null ? void 0 : a.text;
      if (typeof c == "string")
        yield c;
      else
        throw new Error("Unexpected response shape – no text candidate");
    }
  }
}
class de {
  /**
   * Sets default values for the provider based on given configuration. Configuration guide here:
   * https://github.com/React-ChatBotify-Plugins/llm-connector/blob/main/docs/providers/OpenAI.md
   *
   * @param config configuration for setup
   */
  constructor(e) {
    if (this.debug = !1, this.roleMap = (t) => {
      switch (t) {
        case "USER":
          return "user";
        case "SYSTEM":
          return "system";
        default:
          return "assistant";
      }
    }, this.constructBodyWithMessages = (t) => {
      let s;
      return this.messageParser ? s = this.messageParser(t) : s = t.filter(
        (r) => typeof r.content == "string" && r.sender.toUpperCase() !== "SYSTEM"
      ).map((r) => {
        const o = this.roleMap(r.sender.toUpperCase()), a = r.content;
        return {
          role: o,
          content: a
        };
      }), this.systemMessage && (s = [{ role: "system", content: this.systemMessage }, ...s]), {
        messages: s,
        ...this.body
      };
    }, this.handleStreamResponse = async function* (t) {
      var r, o, a;
      const s = new TextDecoder("utf-8");
      let n = "";
      for (; ; ) {
        const { value: d, done: c } = await t.read();
        if (c) break;
        n += s.decode(d, { stream: !0 });
        const l = n.split(/\r?\n/);
        n = l.pop();
        for (const u of l) {
          if (!u.startsWith("data: ")) continue;
          const p = u.slice(6).trim();
          if (p === "[DONE]") return;
          try {
            const g = (a = (o = (r = JSON.parse(p).choices) == null ? void 0 : r[0]) == null ? void 0 : o.delta) == null ? void 0 : a.content;
            g && (yield g);
          } catch (f) {
            console.error("Stream parse error", f);
          }
        }
      }
    }, this.method = e.method ?? "POST", this.endpoint = e.baseUrl ?? "https://api.openai.com/v1/chat/completions", this.systemMessage = e.systemMessage, this.responseFormat = e.responseFormat ?? "stream", this.messageParser = e.messageParser, this.debug = e.debug ?? !1, this.headers = {
      "Content-Type": "application/json",
      Accept: this.responseFormat === "stream" ? "text/event-stream" : "application/json",
      ...e.headers
    }, this.body = {
      model: e.model,
      stream: this.responseFormat === "stream",
      ...e.body
    }, e.mode === "direct") {
      this.headers = { ...this.headers, Authorization: `Bearer ${e.apiKey}` };
      return;
    }
    if (e.mode !== "proxy")
      throw Error("Invalid mode specified for OpenAI provider ('direct' or 'proxy').");
  }
  /**
   * Calls Openai and yields each chunk (or the full text).
   *
   * @param messages messages to include in the request
   */
  async *sendMessages(e) {
    var s, n, r;
    if (this.debug) {
      const o = { ...this.headers };
      delete o.Authorization, console.log("[OpenaiProvider] Request:", {
        method: this.method,
        endpoint: this.endpoint,
        headers: o,
        body: this.constructBodyWithMessages(e)
      });
    }
    const t = await fetch(this.endpoint, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.constructBodyWithMessages(e))
    });
    if (this.debug && console.log("[OpenaiProvider] Response status:", t.status), !t.ok)
      throw new Error(`Openai API error ${t.status}: ${await t.text()}`);
    if (this.responseFormat === "stream") {
      if (!t.body)
        throw new Error("Response body is empty – cannot stream");
      const o = t.body.getReader();
      for await (const a of this.handleStreamResponse(o))
        yield a;
    } else {
      const o = await t.json();
      this.debug && console.log("[OpenaiProvider] Response body:", o);
      const a = (r = (n = (s = o.choices) == null ? void 0 : s[0]) == null ? void 0 : n.message) == null ? void 0 : r.content;
      if (typeof a == "string")
        yield a;
      else
        throw new Error("Unexpected response shape – no text candidate");
    }
  }
}
class le {
  /**
   * Sets default values for the provider based on given configuration. Configuration guide here:
   * https://github.com/React-ChatBotify-Plugins/llm-connector/blob/main/docs/providers/WebLlm.md
   *
   * @param config configuration for setup
   */
  constructor(e) {
    this.debug = !1, this.roleMap = (t) => {
      switch (t) {
        case "USER":
          return "user";
        case "SYSTEM":
          return "system";
        default:
          return "assistant";
      }
    }, this.constructBodyWithMessages = (t) => {
      let s;
      return this.messageParser ? s = this.messageParser(t) : s = t.filter(
        (r) => typeof r.content == "string" && r.sender.toUpperCase() !== "SYSTEM"
      ).map((r) => {
        const o = this.roleMap(r.sender.toUpperCase()), a = r.content;
        return {
          role: o,
          content: a
        };
      }), this.systemMessage && (s = [
        {
          role: "system",
          content: this.systemMessage
        },
        ...s
      ]), {
        messages: s,
        stream: this.responseFormat === "stream",
        ...this.chatCompletionOptions
      };
    }, this.model = e.model, this.systemMessage = e.systemMessage, this.responseFormat = e.responseFormat ?? "stream", this.messageParser = e.messageParser, this.engineConfig = e.engineConfig ?? {}, this.chatCompletionOptions = e.chatCompletionOptions ?? {}, this.debug = e.debug ?? !1, this.createEngine();
  }
  /**
   * Creates MLC Engine for inferencing.
   */
  async createEngine() {
    const { CreateMLCEngine: e } = await import("@mlc-ai/web-llm");
    this.engine = await e(this.model, {
      ...this.engineConfig
    });
  }
  /**
   * Calls WebLlm and yields each chunk (or the full text).
   *
   * @param messages messages to include in the request
   */
  async *sendMessages(e) {
    var s, n, r, o, a, d;
    this.engine || await this.createEngine(), this.debug && console.log("[WebLlmProvider] Request:", {
      model: this.model,
      systemMessage: this.systemMessage,
      responseFormat: this.responseFormat,
      engineConfig: this.engineConfig,
      chatCompletionOptions: this.chatCompletionOptions,
      messages: this.constructBodyWithMessages(e).messages
      // Log messages being sent
    });
    const t = await ((s = this.engine) == null ? void 0 : s.chat.completions.create(this.constructBodyWithMessages(e)));
    if (this.debug && console.log("[WebLlmProvider] Response:", t), t && Symbol.asyncIterator in t)
      for await (const c of t) {
        const l = (r = (n = c.choices[0]) == null ? void 0 : n.delta) == null ? void 0 : r.content;
        l && (yield l);
      }
    else (d = (a = (o = t == null ? void 0 : t.choices) == null ? void 0 : o[0]) == null ? void 0 : a.message) != null && d.content && (yield t.choices[0].message.content);
  }
}
class he {
  /**
   * Sets default values for the provider based on given configuration. Configuration guide here:
   * https://github.com/React-ChatBotify-Plugins/llm-connector/blob/main/docs/providers/OpenAI.md
   *
   * @param config configuration for setup
   */
  constructor(e) {
    if (this.debug = !1, this.roleMap = (t) => {
      switch (t) {
        case "USER":
          return "user";
        case "SYSTEM":
          return "system";
        default:
          return "assistant";
      }
    }, this.constructBodyWithMessages = (t) => {
      let s;
      return this.messageParser ? s = this.messageParser(t) : s = t.filter(
        (r) => typeof r.content == "string" && r.sender.toUpperCase() !== "SYSTEM"
      ).map((r) => {
        const o = this.roleMap(r.sender.toUpperCase()), a = r.content;
        return {
          role: o,
          content: a
        };
      }), this.systemMessage && (s = [{ role: "system", content: this.systemMessage }, ...s]), {
        model: this.body.model,
        messages: s
      };
    }, this.handleStreamResponse = async function* (t) {
      const s = new TextDecoder("utf-8");
      let n = "";
      for (; ; ) {
        const { value: r, done: o } = await t.read();
        if (o) break;
        n += s.decode(r, { stream: !0 });
        const a = n.split(/\r?\n/);
        n = a.pop();
        for (const d of a)
          try {
            const c = JSON.parse(d);
            if (c.done === !0) return;
            c.message && typeof c.message.content == "string" && (yield c.message.content);
          } catch (c) {
            console.error("Stream parse error", c);
          }
      }
    }, this.method = e.method ?? "POST", this.endpoint = e.baseUrl ?? "http://localhost:11434/api/chat", this.systemMessage = e.systemMessage, this.responseFormat = e.responseFormat ?? "stream", this.messageParser = e.messageParser, this.debug = e.debug ?? !1, this.headers = {
      "Content-Type": "application/json",
      Accept: this.responseFormat === "stream" ? "text/event-stream" : "application/json",
      ...e.headers
    }, this.body = {
      model: e.model,
      stream: this.responseFormat === "stream",
      ...e.body
    }, e.mode === "direct") {
      this.headers = { ...this.headers, Authorization: `Bearer ${e.apiKey}` };
      return;
    }
    if (e.mode !== "proxy")
      throw Error("Invalid mode specified for Ollama provider ('direct' or 'proxy').");
  }
  /**
   * Calls Ollama and yields each chunk (or the full text).
   *
   * @param messages messages to include in the request
   */
  async *sendMessages(e) {
    var s, n, r;
    if (this.debug) {
      const o = { ...this.headers };
      delete o.Authorization, console.log("[OllamaProvider] Request:", {
        method: this.method,
        endpoint: this.endpoint,
        headers: o,
        body: this.constructBodyWithMessages(e)
      });
    }
    const t = await fetch(this.endpoint, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.constructBodyWithMessages(e))
    });
    if (this.debug && console.log("[OllamaProvider] Response status:", t.status), !t.ok)
      throw new Error(`Ollama API error ${t.status}: ${await t.text()}`);
    if (this.responseFormat === "stream") {
      if (!t.body)
        throw new Error("Response body is empty – cannot stream");
      const o = t.body.getReader();
      for await (const a of this.handleStreamResponse(o))
        yield a;
    } else {
      const o = await t.json();
      this.debug && console.log("[OllamaProvider] Response body:", o);
      const a = (r = (n = (s = o.choices) == null ? void 0 : s[0]) == null ? void 0 : n.message) == null ? void 0 : r.content;
      if (typeof a == "string")
        yield a;
      else
        throw new Error("Unexpected response shape – no text candidate");
    }
  }
}
export {
  ce as GeminiProvider,
  he as OllamaProvider,
  de as OpenaiProvider,
  le as WebLlmProvider,
  ie as default
};
