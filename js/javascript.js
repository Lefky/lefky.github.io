(() => {
  // js/time-calc.js
  function floatToTimeString(timedec) {
    if (timedec === "correction") {
      return timedec;
    }
    const num = parseFloat(timedec);
    if (isNaN(num)) {
      return "00:00";
    }
    const sign = num < 0 ? "-" : "";
    const absVal = Math.abs(num);
    const totalMinutes = Math.round(absVal * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return sign + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
  }
  function timeStringToFloat(timestring) {
    if (!timestring) return 0;
    if (typeof dayjs !== "undefined" && dayjs.duration) {
      const time = dayjs(timestring, "HH:mm");
      return dayjs.duration(time.diff(time.startOf("day")), "milliseconds").asHours();
    }
    const parts = timestring.split(":");
    if (parts.length >= 2) {
      const hours = parseFloat(parts[0]) || 0;
      const minutes = parseFloat(parts[1]) || 0;
      return hours + minutes / 60;
    }
    return 0;
  }
  var reverseDateRepresentation = (date) => {
    if (date) {
      const parts = date.split("-");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return "";
  };
  function testDateFormat(date) {
    const userKeyRegExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/;
    return userKeyRegExp.test(date);
  }
  function now() {
    if (typeof dayjs !== "undefined" && dayjs.duration) {
      const currentTime = dayjs();
      return dayjs.duration(currentTime.diff(currentTime.startOf("day")), "milliseconds").asHours();
    }
    const d = /* @__PURE__ */ new Date();
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  }
  function todayDate() {
    if (typeof dayjs !== "undefined") {
      return dayjs().format("DD-MM-YYYY");
    }
    const d = /* @__PURE__ */ new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
  function calculateWorktime(startDec, endDec, hourSchedule = 0, breakDec = 0) {
    let grossWorktime = endDec - startDec;
    if (endDec < startDec) {
      grossWorktime = 24 + grossWorktime;
    }
    const sched = parseFloat(hourSchedule) || 0;
    const brk = parseFloat(breakDec) || 0;
    const netWorktime = grossWorktime - brk;
    if (sched > 0 && Math.abs(netWorktime - sched) <= 0.02) {
      grossWorktime = sched + brk;
    }
    return grossWorktime.toFixed(2);
  }
  function calculateOvertime(worktime, breakTime, hourSchedule) {
    const workDec = parseFloat(worktime) || 0;
    const breakDec = parseFloat(breakTime) || 0;
    const schedDec = parseFloat(hourSchedule) || 0;
    let overtimeNum = workDec - breakDec - schedDec;
    if (schedDec > 0 && Math.abs(overtimeNum) <= 0.015) {
      overtimeNum = 0;
    }
    const overtime = overtimeNum.toFixed(2);
    if (overtime === "-0.00") {
      return "0.00";
    }
    return overtime;
  }
  function calculateTotalNoBreak(worktime, breakTime) {
    const workDec = parseFloat(worktime) || 0;
    const breakDec = parseFloat(breakTime) || 0;
    return Math.abs(parseFloat(workDec - breakDec)).toFixed(2);
  }
  function adjustEndTimeForOvertime(startDec, endDec, overtimeDec) {
    const start = parseFloat(startDec) || 0;
    const end = parseFloat(endDec) || 0;
    const overtime = parseFloat(overtimeDec) || 0;
    let shiftDuration = end - start;
    if (shiftDuration < 0) {
      shiftDuration += 24;
    }
    const adjustedDuration = Math.max(0, shiftDuration - overtime);
    return (start + adjustedDuration) % 24;
  }
  function calculateExecutionDay(executionday, period, periodunit) {
    if (typeof dayjs !== "undefined") {
      let date = dayjs();
      const p = parseInt(period, 10) || 0;
      const ed = parseInt(executionday, 10);
      if (periodunit === "days") {
        date = date.add(p, "days");
      } else if (periodunit === "weeks") {
        date = date.add(p, "weeks");
        date = date.day(ed);
      } else if (periodunit === "months") {
        date = date.add(p, "months");
        date = date.date(ed);
      }
      return date;
    }
    return null;
  }
  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  var Timer = class {
    constructor() {
      this.isRunning = false;
      this.startTime = 0;
      this.overallTime = 0;
    }
    _getTimeElapsedSinceLastStart() {
      if (!this.startTime) {
        return 0;
      }
      return Date.now() - this.startTime;
    }
    start() {
      if (this.isRunning) {
        return console.warn("Timer is already running");
      }
      this.isRunning = true;
      this.startTime = Date.now();
    }
    stop() {
      if (!this.isRunning) {
        return console.warn("Timer is already stopped");
      }
      this.isRunning = false;
      this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }
    reset() {
      this.overallTime = 0;
      if (this.isRunning) {
        this.startTime = Date.now();
        return;
      }
      this.startTime = 0;
    }
    getTime() {
      if (!this.startTime) {
        return 0;
      }
      if (this.isRunning) {
        return this.overallTime + this._getTimeElapsedSinceLastStart();
      }
      return this.overallTime;
    }
  };

  // js/storage.js
  function getHistoryKeys() {
    const keys = Object.keys(localStorage);
    const sortedkeys = keys.map(reverseDateRepresentation).sort().map(reverseDateRepresentation);
    const validKeys = [];
    for (let i = 0; i < sortedkeys.length; i++) {
      const key = sortedkeys[i];
      if (testDateFormat(key)) {
        validKeys.push(key);
      }
    }
    return validKeys;
  }
  function getHistoryDeleteOption() {
    const periodRadio = document.getElementById("historydeleteoptionperiod");
    const daysRadio = document.getElementById("historydeleteoptiondays");
    if (periodRadio && periodRadio.checked) {
      return periodRadio.value;
    } else if (daysRadio && daysRadio.checked) {
      return daysRadio.value;
    }
    return localStorage.getItem("historydeleteoption") || "days";
  }
  function getHistoryRetain() {
    const elem = document.getElementById("historyretain");
    let days = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("historyretain"), 10);
    if (!days || isNaN(days)) {
      days = 99999;
    } else if (days > 99999) {
      days = 99999;
    }
    return days;
  }
  function getHistoryResetDay() {
    const elem = document.getElementById("historyresetday");
    let day = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("historyresetday"), 10);
    if (!day || isNaN(day)) {
      day = 31;
    } else if (day > 31) {
      day = 31;
    }
    return day;
  }
  function getHistoryResetPeriod() {
    const elem = document.getElementById("historyresetperiod");
    let period = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("historyresetperiod"), 10);
    const unit = getHistoryResetPeriodUnit();
    if (isNaN(period) || !period) {
      period = 1;
    }
    if (unit === "days") {
      period = period > 31 ? 31 : period;
    } else if (unit === "weeks") {
      period = period > 4 ? 4 : period;
    } else if (unit === "months") {
      period = period > 48 ? 48 : period;
    }
    return period;
  }
  function getHistoryResetPeriodUnit() {
    const elem = document.getElementById("historyresetperiodunit");
    if (elem && elem.selectedIndex >= 0) {
      return elem.options[elem.selectedIndex].value;
    }
    return localStorage.getItem("historyresetperiodunit") || "days";
  }
  function getAutobackupDay() {
    const elem = document.getElementById("autobackupday");
    let day = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("autobackupday"), 10);
    if (!day || isNaN(day)) {
      day = 31;
    } else if (day > 31) {
      day = 31;
    }
    return day;
  }
  function getAutobackupPeriod() {
    const elem = document.getElementById("autobackupperiod");
    let period = elem ? parseInt(elem.value, 10) : parseInt(localStorage.getItem("autobackupperiod"), 10);
    const unit = getAutobackupPeriodUnit();
    if (isNaN(period) || !period) {
      period = 1;
    }
    if (unit === "days") {
      period = period > 31 ? 31 : period;
    } else if (unit === "weeks") {
      period = period > 4 ? 4 : period;
    } else if (unit === "months") {
      period = period > 48 ? 48 : period;
    }
    return period;
  }
  function getAutobackupPeriodUnit() {
    const elem = document.getElementById("autobackupperiodunit");
    if (elem && elem.selectedIndex >= 0) {
      return elem.options[elem.selectedIndex].value;
    }
    return localStorage.getItem("autobackupperiodunit") || "days";
  }
  function getDayRecord(dateKey) {
    try {
      const raw = localStorage.getItem(dateKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Failed to parse record for " + dateKey, e);
      return null;
    }
  }
  function saveDayRecord(dateKey, record) {
    localStorage.setItem(dateKey, JSON.stringify(record));
  }
  function cleanLocalStorage(onHistoryChanged) {
    if (typeof dayjs === "undefined") return;
    const keys = Object.keys(localStorage);
    const today = dayjs();
    const deleteoption = localStorage.getItem("historydeleteoption");
    if (deleteoption === "days") {
      const expiredate = today.subtract(getHistoryRetain(), "days");
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (testDateFormat(key) && dayjs(key, "DD-MM-YYYY").isBefore(expiredate)) {
          delete localStorage[key];
        }
      }
    } else if (deleteoption === "period") {
      const cleaningdaystored = localStorage.getItem("cleaningday");
      if (cleaningdaystored) {
        const cleaningday = dayjs(cleaningdaystored, "DD-MM-YYYY");
        if (cleaningday.isSameOrBefore(today)) {
          deleteHistory(onHistoryChanged);
          const nextDate = calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit());
          if (nextDate) {
            localStorage.setItem("cleaningday", nextDate.format("DD-MM-YYYY"));
          }
        }
      }
    }
  }
  function autoBackup(exportCallback) {
    if (typeof dayjs === "undefined") return;
    const today = dayjs();
    const backupsenabled = localStorage.getItem("autobackupoption");
    const autobackupdaystored = localStorage.getItem("autobackupdate");
    if (backupsenabled === "true" && autobackupdaystored) {
      const autobackupday = dayjs(autobackupdaystored, "DD-MM-YYYY");
      if (autobackupday.isSameOrBefore(today)) {
        if (typeof alert !== "undefined") {
          alert("Performing autobackup");
        }
        if (typeof exportCallback === "function") {
          exportCallback();
        } else if (typeof window !== "undefined" && typeof window.exportHistory === "function") {
          window.exportHistory();
        }
        const nextDate = calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit());
        if (nextDate) {
          localStorage.setItem("autobackupdate", nextDate.format("DD-MM-YYYY"));
        }
      }
    }
  }
  function deleteHistory(onSuccess) {
    if (confirm("Are you sure you wish to delete your history?\nIf you choose not to, then your data will be saved until the next cleaning time.")) {
      for (const key in localStorage) {
        if (testDateFormat(key)) {
          delete localStorage[key];
        }
      }
      if (typeof onSuccess === "function") {
        onSuccess();
      } else if (typeof window !== "undefined" && typeof window.setHistory === "function") {
        window.setHistory(true);
      }
      alert("History deleted!");
    }
  }
  function saveCleaningDay() {
    if (typeof window !== "undefined" && typeof window.maxValuesCustomTimeOption === "function") {
      window.maxValuesCustomTimeOption(
        "cleaning",
        getHistoryResetPeriodUnit(),
        calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit()),
        document.getElementById("historyresetperiod"),
        document.getElementById("historyresetday")
      );
    }
    const resetDateElem = document.getElementById("resetdate");
    if (resetDateElem && typeof dayjs !== "undefined") {
      localStorage.setItem("cleaningday", dayjs(resetDateElem.value, "dddd, DD-MM-YYYY").format("DD-MM-YYYY"));
    }
    localStorage.setItem("historyresetday", getHistoryResetDay().toString());
    localStorage.setItem("historyresetperiod", getHistoryResetPeriod().toString());
    localStorage.setItem("historyresetperiodunit", getHistoryResetPeriodUnit());
    const saveBtn = document.getElementById("cleaningdaysavebutton");
    if (saveBtn) {
      saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: var(--bs-success);");
      saveBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(function() {
        saveBtn.innerHTML = "Save";
        saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");
      }, 5e3);
    }
  }
  function saveBackupDay() {
    if (typeof window !== "undefined" && typeof window.maxValuesCustomTimeOption === "function") {
      window.maxValuesCustomTimeOption(
        "autobackup",
        getAutobackupPeriodUnit(),
        calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit()),
        document.getElementById("autobackupperiod"),
        document.getElementById("autobackupday")
      );
    }
    const backupDateElem = document.getElementById("autobackupdate");
    if (backupDateElem && typeof dayjs !== "undefined") {
      localStorage.setItem("autobackupdate", dayjs(backupDateElem.value, "dddd, DD-MM-YYYY").format("DD-MM-YYYY"));
    }
    localStorage.setItem("autobackupday", getAutobackupDay().toString());
    localStorage.setItem("autobackupperiod", getAutobackupPeriod().toString());
    localStorage.setItem("autobackupperiodunit", getAutobackupPeriodUnit());
    const saveBtn = document.getElementById("autobackupsavebutton");
    if (saveBtn) {
      saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear; color: white; background-color: var(--bs-success);");
      saveBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(function() {
        saveBtn.innerHTML = "Save";
        saveBtn.setAttribute("style", "float: none; margin-left: 5px; vertical-align: middle; transition: 0.7s linear;");
      }, 5e3);
    }
  }

  // js/ui.js
  var bs_blue;
  var bs_indigo;
  var bs_purple;
  var bs_pink;
  var bs_red;
  var bs_orange;
  var bs_yellow;
  var bs_green;
  var bs_teal;
  var bs_cyan;
  var bs_white;
  var bs_gray;
  var bs_gray_dark;
  var bs_primary;
  var bs_secondary;
  var bs_success;
  var bs_info;
  var bs_warning;
  var bs_danger;
  var bs_light;
  var bs_light_subtle;
  var bs_dark;
  var bs_body_bg;
  var bs_washed_red;
  var bs_washed_yellow;
  var bs_washed_green;
  var colorScheme = "light";
  function importBootstrapColors() {
    const style = getComputedStyle(document.documentElement);
    bs_blue = style.getPropertyValue("--bs-blue");
    bs_indigo = style.getPropertyValue("--bs-indigo");
    bs_purple = style.getPropertyValue("--bs-purple");
    bs_pink = style.getPropertyValue("--bs-pink");
    bs_red = style.getPropertyValue("--bs-red");
    bs_orange = style.getPropertyValue("--bs-orange");
    bs_yellow = style.getPropertyValue("--bs-yellow");
    bs_green = style.getPropertyValue("--bs-green");
    bs_teal = style.getPropertyValue("--bs-teal");
    bs_cyan = style.getPropertyValue("--bs-cyan");
    bs_white = style.getPropertyValue("--bs-white");
    bs_gray = style.getPropertyValue("--bs-gray");
    bs_gray_dark = style.getPropertyValue("--bs-gray-dark");
    bs_primary = style.getPropertyValue("--bs-primary");
    bs_secondary = style.getPropertyValue("--bs-secondary");
    bs_success = style.getPropertyValue("--bs-success");
    bs_info = style.getPropertyValue("--bs-info");
    bs_warning = style.getPropertyValue("--bs-warning");
    bs_danger = style.getPropertyValue("--bs-danger");
    bs_light = style.getPropertyValue("--bs-light");
    bs_light_subtle = style.getPropertyValue("--bs-light-bg-subtle");
    bs_dark = style.getPropertyValue("--bs-dark");
    bs_body_bg = style.getPropertyValue("--bs-body-bg");
    bs_washed_red = (style.getPropertyValue("--bs-washed-red") || "").trim();
    bs_washed_yellow = (style.getPropertyValue("--bs-washed-yellow") || "").trim();
    bs_washed_green = (style.getPropertyValue("--bs-washed-green") || "").trim();
    if (typeof window !== "undefined") {
      window.bs_blue = bs_blue;
      window.bs_indigo = bs_indigo;
      window.bs_purple = bs_purple;
      window.bs_pink = bs_pink;
      window.bs_red = bs_red;
      window.bs_orange = bs_orange;
      window.bs_yellow = bs_yellow;
      window.bs_green = bs_green;
      window.bs_teal = bs_teal;
      window.bs_cyan = bs_cyan;
      window.bs_white = bs_white;
      window.bs_gray = bs_gray;
      window.bs_gray_dark = bs_gray_dark;
      window.bs_primary = bs_primary;
      window.bs_secondary = bs_secondary;
      window.bs_success = bs_success;
      window.bs_info = bs_info;
      window.bs_warning = bs_warning;
      window.bs_danger = bs_danger;
      window.bs_light = bs_light;
      window.bs_light_subtle = bs_light_subtle;
      window.bs_dark = bs_dark;
      window.bs_body_bg = bs_body_bg;
      window.bs_washed_red = bs_washed_red;
      window.bs_washed_yellow = bs_washed_yellow;
      window.bs_washed_green = bs_washed_green;
    }
    function hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
        hex = hex.split("").map((char) => char + char).join("");
      }
      const bigint = parseInt(hex, 16);
      const r = bigint >> 16 & 255;
      const g = bigint >> 8 & 255;
      const b = bigint & 255;
      return { r, g, b };
    }
    const opacity = 0.4;
    try {
      const gray200_hex = style.getPropertyValue("--bs-gray-200").trim();
      const rgb = hexToRgb(gray200_hex);
      if (rgb) {
        const newRule = `
                [data-bs-theme="light"] .bg-light-subtle {
                    background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}) !important;
                }
            `;
        const styleId = "custom-bg-subtle-style";
        let styleElem = document.getElementById(styleId);
        if (!styleElem) {
          styleElem = document.createElement("style");
          styleElem.id = styleId;
          document.head.appendChild(styleElem);
        }
        styleElem.textContent = newRule;
      }
    } catch (e) {
      console.error("Error applying custom bg-light-subtle style:", e);
    }
  }
  var timer = new Timer();
  var weeklyOvertimeBalance = 0;
  var break_counter_started = false;
  var refreshIntervalId = 0;
  function getStart() {
    const elem = document.getElementById("start_time");
    let time_dec = elem ? timeStringToFloat(elem.value) : 0;
    return time_dec || 0;
  }
  function setStart(time) {
    const elem = document.getElementById("start_time");
    if (elem) elem.value = floatToTimeString(time);
  }
  function getEnd() {
    const elem = document.getElementById("end_time");
    let time_dec = elem ? timeStringToFloat(elem.value) : 0;
    if (!time_dec) time_dec = now();
    return time_dec;
  }
  function setEnd(time) {
    if (time > 24) time = time - 24;
    const elem = document.getElementById("end_time");
    if (elem) elem.value = floatToTimeString(time);
  }
  function getBreak(allowNegative) {
    let time_dec;
    const timerangeOpt = document.getElementById("breaktime_timeselection_option_timerange");
    if (!timerangeOpt || !timerangeOpt.checked) {
      const breakInput = document.getElementById("break_time");
      time_dec = breakInput ? timeStringToFloat(breakInput.value) : 0;
    } else {
      const breakStart = document.getElementById("break_time_start");
      const breakEnd = document.getElementById("break_time_end");
      if (typeof dayjs !== "undefined" && breakStart && breakEnd) {
        const startObj = dayjs(breakStart.value, "HH:mm");
        const endObj = dayjs(breakEnd.value, "HH:mm");
        time_dec = dayjs.duration(endObj.diff(startObj)).asHours();
      } else {
        time_dec = 0;
      }
    }
    if (!allowNegative && (!time_dec || time_dec < 0)) {
      time_dec = 0;
    }
    return time_dec;
  }
  function getBreakTimeStart() {
    const elem = document.getElementById("break_time_start");
    let time_dec = elem ? timeStringToFloat(elem.value) : 0;
    return time_dec || 0;
  }
  function setBreak(time) {
    const breakInput = document.getElementById("break_time");
    const breakStart = document.getElementById("break_time_start");
    const breakEnd = document.getElementById("break_time_end");
    if (breakInput) breakInput.value = floatToTimeString(time);
    if (breakStart) breakStart.value = "00:00";
    if (breakEnd) breakEnd.value = floatToTimeString(time);
  }
  function getBreakDefault() {
    const break_time = document.getElementById("break_time_default");
    if (!break_time || break_time.selectedIndex < 0) return 0;
    let time = break_time.options[break_time.selectedIndex].value;
    return time || 0;
  }
  function setBreakDefault(time) {
    const elem = document.getElementById("break_time_default");
    if (elem) elem.value = floatToTimeString(time);
  }
  function addBreakDefault() {
    const break_time_default_init = localStorage.getItem("break_time_default");
    if (getBreak(false) === break_time_default_init) {
      setBreak(getBreakDefault());
      setEnd(parseFloat(getEnd()) + parseFloat(getBreakDefault()) - break_time_default_init);
    }
    localStorage.setItem("break_time_default", getBreakDefault());
    calculateTotal();
  }
  function getHourSchedule() {
    const hourschedule = document.getElementById("hourschedule");
    if (!hourschedule || hourschedule.selectedIndex < 0) return 7.6;
    let time = hourschedule.options[hourschedule.selectedIndex].value;
    return time ? parseFloat(time) : 0;
  }
  function setHourSchedule(time) {
    const elem = document.getElementById("hourschedule");
    if (elem) {
      elem.value = time ? time : "7.6";
    }
    hourscheduleAddTimeButton(getHourSchedule());
  }
  function setCustomHourSchedule(time) {
    if (time) {
      localStorage.setItem("customhourschedule_value", time);
      localStorage.setItem("hourschedule", time);
      setCustomHourScheduleUI(time);
    } else {
      localStorage.removeItem("customhourschedule_value");
    }
  }
  function setCustomHourScheduleUI(time) {
    const input = document.getElementById("customhourschedule_value");
    if (input) input.value = time || "";
    const select = document.getElementById("hourschedule");
    if (!select) return;
    const existingOption = document.getElementById("customhourschedule_value_option");
    if (existingOption) existingOption.remove();
    if (time) {
      const custom_option = document.createElement("option");
      custom_option.value = time;
      custom_option.id = "customhourschedule_value_option";
      if (time.includes(",")) {
        custom_option.innerHTML = time + "h &ensp;&ensp;&emsp;&emsp;(custom option)";
      } else {
        custom_option.innerHTML = time + "h &ensp;&nbsp;&emsp;&emsp;&emsp;(custom option)";
      }
      select.appendChild(custom_option);
      select.value = time;
    }
  }
  function getWorktime() {
    return calculateWorktime(getStart(), getEnd(), getHourSchedule(), getBreak(false));
  }
  function calculateTotal() {
    const worktime = getWorktime();
    const overtimedec = getOvertimeDec();
    const totalnobreakdec = getTotalNoBreakDec();
    setTotal(worktime);
    setOvertime(overtimedec);
    setTotalNoBreak(totalnobreakdec);
    setTotalDec(worktime);
    setOvertimeDec(overtimedec);
    setTotalNoBreakDec(totalnobreakdec);
    hourscheduleAddTimeButton(getHourSchedule());
  }
  function setTotal(time) {
    let numTime = parseFloat(time);
    if (numTime < 0) numTime = numTime + 24;
    const elem = document.getElementById("total");
    if (elem) elem.value = floatToTimeString(numTime);
  }
  function getTotalDec() {
    return parseFloat(getWorktime()).toFixed(2);
  }
  function setTotalDec(time) {
    const elem = document.getElementById("totaldec");
    if (!elem) return;
    if (parseFloat(time) < 0) {
      elem.value = "";
    } else {
      elem.value = time;
    }
  }
  function setOvertime(time) {
    const elem = document.getElementById("overtime");
    if (elem) elem.value = floatToTimeString(time);
  }
  function getOvertimeDec() {
    return calculateOvertime(getWorktime(), getBreak(false), getHourSchedule());
  }
  function setOvertimeDec(time) {
    const elem = document.getElementById("overtimedec");
    if (elem) elem.value = time;
  }
  function setOvertimeTotal(time) {
    const elem = document.getElementById("overtimetotal");
    if (!elem) return;
    elem.value = floatToTimeString(time);
    if (time >= 0) {
      elem.setAttribute("style", "color: var(--bs-success);");
    } else {
      elem.setAttribute("style", "color: var(--bs-danger);");
    }
  }
  function setOvertimeWeekly(time) {
    const elem = document.getElementById("overtimeweekly");
    if (!elem) return;
    elem.value = floatToTimeString(time);
    if (time >= 0) {
      elem.setAttribute("style", "color: var(--bs-success);");
    } else {
      elem.setAttribute("style", "color: var(--bs-danger);");
    }
  }
  function setTotalNoBreak(time) {
    const elem = document.getElementById("totalnobreak");
    if (elem) elem.value = floatToTimeString(time);
  }
  function getTotalNoBreakDec() {
    return calculateTotalNoBreak(getWorktime(), getBreak(false));
  }
  function setTotalNoBreakDec(time) {
    const elem = document.getElementById("totalnobreakdec");
    if (!elem) return;
    if (parseFloat(time) < 0) {
      elem.value = "";
    } else {
      elem.value = time;
    }
  }
  function getSummary() {
    const elem = document.getElementById("summary");
    return elem ? elem.value : "";
  }
  function setSummary(summary) {
    const elem = document.getElementById("summary");
    if (elem && summary && summary.trim().length > 0) {
      elem.value = summary.replace(/\\n/g, "\n");
    }
  }
  function setResetDate(date) {
    const elem = document.getElementById("resetdate");
    if (elem) elem.value = date;
  }
  function getResetDate() {
    const elem = document.getElementById("resetdate");
    return elem ? elem.value : "";
  }
  function setBackupDate(date) {
    const elem = document.getElementById("autobackupdate");
    if (elem) elem.value = date;
  }
  function getBackupDate() {
    const elem = document.getElementById("autobackupdate");
    return elem ? elem.value : "";
  }
  function showHistorydeleteoptionContent() {
    const daysChecked = document.getElementById("historydeleteoptiondays") && document.getElementById("historydeleteoptiondays").checked;
    const daysContent = document.getElementById("historydeleteoptiondayscontent");
    const periodsContent = document.getElementById("historydeleteoptionperiodscontent");
    if (daysChecked) {
      if (daysContent) daysContent.classList.remove("d-none");
      if (periodsContent) periodsContent.classList.add("d-none");
    } else {
      if (daysContent) daysContent.classList.add("d-none");
      if (periodsContent) periodsContent.classList.remove("d-none");
      maxValuesCustomTimeOption(
        "cleaning",
        getHistoryResetPeriodUnit(),
        calculateExecutionDay(getHistoryResetDay(), getHistoryResetPeriod(), getHistoryResetPeriodUnit()),
        document.getElementById("historyresetperiod"),
        document.getElementById("historyresetday")
      );
    }
  }
  function maxValuesCustomTimeOption(type, periodunit, executionday, elem_period, elem_executionday) {
    if (!elem_period || !elem_executionday) return;
    if (periodunit === "days") {
      elem_period.setAttribute("max", "31");
      elem_executionday.value = "1";
      elem_executionday.disabled = true;
    } else if (periodunit === "weeks") {
      elem_period.setAttribute("max", "4");
      elem_executionday.setAttribute("max", "7");
      elem_executionday.disabled = false;
    } else if (periodunit === "months") {
      elem_period.setAttribute("max", "48");
      elem_executionday.setAttribute("max", "31");
      elem_executionday.disabled = false;
    }
    if (executionday) {
      if (type === "cleaning") {
        setResetDate(executionday.format("dddd, DD-MM-YYYY"));
      } else if (type === "autobackup") {
        setBackupDate(executionday.format("dddd, DD-MM-YYYY"));
      }
    }
  }
  function setHistory(refresh_edit_table) {
    let entry_history = "<table width='100%' height='100%'><tr style='border-bottom: 1px solid var(--bs-secondary);'><th style='width: 33%;'>Date</th><th style='width: 33%;text-align:right;'>Time (no break)</th><th style='width: 33%;text-align:right;'>Overtime</th></tr>";
    let entry_edit_history = "";
    const revkeys = getHistoryKeys().reverse();
    let overtimetotal = 0;
    let overtimeweekly = 0;
    for (let i = 0; i < revkeys.length; i++) {
      const key = revkeys[i];
      try {
        const timeinfo = JSON.parse(localStorage.getItem(key));
        if (timeinfo && Object.prototype.hasOwnProperty.call(timeinfo, "OvertimeDec")) {
          if (timeinfo.Summary === void 0) {
            timeinfo.Summary = "";
          }
          const colorClass = parseFloat(timeinfo.OvertimeDec) < 0 ? "text-danger" : "text-success";
          entry_history += `<tr class='${colorClass}'><td>${key}</td><td style='text-align:right;'>${floatToTimeString(timeinfo.TotalNoBreakDec)}</td><td style='text-align:right;'>${floatToTimeString(timeinfo.OvertimeDec)}</td></tr>`;
          overtimetotal += parseFloat(timeinfo.OvertimeDec) || 0;
          if (typeof dayjs !== "undefined" && key !== todayDate() && dayjs(key, "DD-MM-YYYY").isSameOrAfter(dayjs().startOf("week"))) {
            overtimeweekly += parseFloat(timeinfo.OvertimeDec) || 0;
          }
          const dateIso = reverseDateRepresentation(key);
          const startString = timeinfo.StartDec !== "correction" ? floatToTimeString(timeinfo.StartDec) : "";
          const workedString = timeinfo.TotalNoBreakDec !== "correction" ? floatToTimeString(timeinfo.TotalNoBreakDec) : "";
          let breakDec = 0;
          if (timeinfo.TotalDec !== "correction" && timeinfo.TotalNoBreakDec !== "correction") {
            breakDec = Math.abs(parseFloat(timeinfo.TotalDec) - parseFloat(timeinfo.TotalNoBreakDec));
          }
          const breakString = floatToTimeString(breakDec);
          const scheduleVal = timeinfo.HourSchedule || "";
          const summaryVal = timeinfo.Summary ? timeinfo.Summary.replace(/"/g, "&quot;") : "";
          entry_edit_history += `
				<tr>
					<td class="p-1">
						<input type="date" class="form-control history-date" value="${dateIso}">
					</td>
					<td class="p-1">
						<input type="time" class="form-control history-start" value="${startString}">
					</td>
					<td class="p-1">
						<input type="time" class="form-control history-break" value="${breakString}">
					</td>
					<td class="p-1">
						<input type="time" class="form-control history-total" value="${workedString}">
					</td>
					<td class="p-1">
						<input type="number" step="0.01" class="form-control history-schedule" value="${scheduleVal}">
					</td>
					<td class="p-1">
						<input type="text" class="form-control history-summary" value="${summaryVal}">
					</td>
					<td>
						<span class="record-save">
							<button type="button" class="btn btn-outline-success btn-sm">
								<i class="fa fa-save"></i>
							</button>
						</span>
						<span class="record-delete">
							<button type="button" class="btn btn-outline-danger btn-sm">
								<i class="fa fa-trash"></i>
							</button>
						</span>
					</td>
				</tr>`;
        }
      } catch (e) {
        console.error("Error processing history for " + key, e);
      }
    }
    if (revkeys.length === 0) {
      entry_history = "No previous data yet :(";
      entry_edit_history = entry_history;
    } else {
      entry_history = entry_history + "</table>";
    }
    const historyElem = document.getElementById("history");
    if (historyElem) historyElem.innerHTML = entry_history;
    if (refresh_edit_table) {
      const editHistoryElem = document.getElementById("edit_history_table_body");
      if (editHistoryElem) editHistoryElem.innerHTML = entry_edit_history;
    }
    setOvertimeTotal(overtimetotal);
    weeklyOvertimeBalance = overtimeweekly;
    setOvertimeWeekly(overtimeweekly);
  }
  function notificationClosed(event) {
    const versionElem = document.getElementById("currentappversion");
    const version = versionElem ? versionElem.innerHTML : "";
    const notif = document.getElementById("alertnotification");
    const notificationVersion = notif ? notif.dataset.notificationVersion || version : version;
    const lastnotifversion = localStorage.getItem("lastnotifversion");
    if (event === "click") {
      localStorage.setItem("lastnotifversion", notificationVersion);
    }
    if (event === "onload" && notif && notificationVersion !== lastnotifversion) {
      notif.style.display = "block";
      notif.classList.add("show");
    }
  }
  function set_startminsubtract(startminsubtract_value) {
    localStorage.setItem("startminsubtract_value", startminsubtract_value);
    const span = document.getElementById("startminsubtract_span");
    if (span) span.innerHTML = startminsubtract_value;
    const valInput = document.getElementById("startminsubtract_value");
    if (valInput) valInput.value = startminsubtract_value;
  }
  function hourscheduleAddTimeButton(hourSchedule) {
    const span = document.getElementById("addtimebutton_span");
    if (span) span.innerHTML = hourSchedule;
  }
  function breaktimeTimeselection() {
    const timerangeOpt = document.getElementById("breaktime_timeselection_option_timerange");
    const isDuration = !timerangeOpt || !timerangeOpt.checked;
    const timerangeDiv = document.getElementById("breaktime_timeselection_option_timerange_div");
    const breakDefaultLabel = document.getElementById("break_time_default_label");
    const breakDefaultDiv = document.getElementById("break_time_default_div");
    const durationDiv = document.getElementById("breaktime_timeselection_option_duration_div");
    const breakBtnDiv = document.getElementById("break_btn_div");
    const breakResetBtn = document.getElementById("break_reset_btn");
    const breakAdd5Btn = document.getElementById("break_add5_btn");
    const breakAdd30Btn = document.getElementById("break_add30_btn");
    const breakCounterBtn = document.getElementById("break_counter_btn");
    if (isDuration) {
      if (timerangeDiv) timerangeDiv.classList.add("d-none");
      if (breakDefaultLabel) breakDefaultLabel.classList.remove("d-none");
      if (breakDefaultDiv) breakDefaultDiv.classList.remove("d-none");
      if (durationDiv) durationDiv.classList.remove("d-none");
      reset_break();
      if (breakBtnDiv) {
        breakBtnDiv.removeAttribute("title");
        breakBtnDiv.removeAttribute("data-toggle");
        breakBtnDiv.removeAttribute("data-placement");
      }
      if (breakResetBtn) breakResetBtn.disabled = false;
      if (breakAdd5Btn) breakAdd5Btn.disabled = false;
      if (breakAdd30Btn) breakAdd30Btn.disabled = false;
      if (breakCounterBtn) breakCounterBtn.disabled = false;
    } else {
      if (timerangeDiv) timerangeDiv.classList.remove("d-none");
      if (breakDefaultLabel) breakDefaultLabel.classList.add("d-none");
      if (breakDefaultDiv) breakDefaultDiv.classList.add("d-none");
      if (durationDiv) durationDiv.classList.add("d-none");
      reset_break();
      if (breakBtnDiv) {
        breakBtnDiv.setAttribute("title", "Only available when break time option is duration. Change this in the settings view.");
        breakBtnDiv.setAttribute("data-toggle", "tooltip");
        breakBtnDiv.setAttribute("data-placement", "top");
      }
      if (breakResetBtn) breakResetBtn.disabled = true;
      if (breakAdd5Btn) breakAdd5Btn.disabled = true;
      if (breakAdd30Btn) breakAdd30Btn.disabled = true;
      if (breakCounterBtn) breakCounterBtn.disabled = true;
    }
    if (typeof bootstrap !== "undefined") {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
          boundary: document.body,
          delay: { show: 1e3, hide: 0 }
        });
      });
    }
  }
  function checkInputValues() {
    let app_alert_message = "";
    if (getBreak(true) < 0 && getBreakTimeStart() > 0) {
      const breakEnd = document.getElementById("break_time_end");
      const breakStart = document.getElementById("break_time_start");
      if (breakEnd && breakStart) breakEnd.value = breakStart.value;
      app_alert_message = "<b>Holy guacamole!</b> You can't end your break before you start it, can you superman?<br> Fill in when your break ended first.";
    }
    setAlertMessage(app_alert_message);
  }
  function setAlertMessage(message) {
    const alertBox = document.getElementById("app_alert");
    const msgBox = document.getElementById("app_alert_message");
    if (alertBox && msgBox && message !== "") {
      msgBox.innerHTML = message;
      alertBox.style.display = "block";
      alertBox.style.opacity = "1";
      setTimeout(function() {
        alertBox.style.transition = "opacity 1s ease-out";
        alertBox.style.opacity = "0";
        setTimeout(() => {
          alertBox.style.display = "none";
        }, 1e3);
      }, 1e4);
    }
  }
  function allCheckBox(allCheckboxInput, elementId) {
    const checks = document.querySelectorAll("#" + elementId + ' input[type="checkbox"]');
    for (let i = 0; i < checks.length; i++) {
      if (allCheckboxInput.checked === true && checks[i].checked === false) {
        checks[i].click();
      } else if (allCheckboxInput.checked === false && checks[i].checked === true) {
        checks[i].click();
      }
    }
  }
  function activateConfirmationModal(message, callback) {
    const modalEl = document.getElementById("modalconfirm");
    if (!modalEl || typeof bootstrap === "undefined") return;
    modalEl.querySelector(".modal-body").innerHTML = "<p>" + message + "</p>";
    const modal = new bootstrap.Modal(modalEl, {});
    modal.show();
    modalEl.addEventListener("shown.bs.modal", function() {
      const buttons = this.querySelectorAll(".btn");
      buttons.forEach((btn) => {
        btn.onclick = () => callback(btn.innerText.toLowerCase());
      });
    }, { once: true });
  }
  function setTheme(theme) {
    if (theme === "auto") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        colorScheme = "dark";
        document.querySelector("html").setAttribute("data-bs-theme", "dark");
      } else {
        colorScheme = "light";
        document.querySelector("html").setAttribute("data-bs-theme", "light");
      }
      localStorage.setItem("theme", "auto");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
      colorScheme = theme;
      localStorage.setItem("theme", theme);
    }
    if (typeof window !== "undefined") {
      window.colorScheme = colorScheme;
    }
  }
  function end_time() {
    setEnd(now());
    calculateTotal();
  }
  function add_time(time) {
    setEnd(getStart() + time + getBreak(false));
    calculateTotal();
  }
  function applyWeeklyOvertime() {
    const adjustedEnd = adjustEndTimeForOvertime(getStart(), getEnd(), weeklyOvertimeBalance);
    setEnd(adjustedEnd);
    calculateTotal();
  }
  function add_break(time) {
    const normalizedTime = Math.abs(time - 0.084) < 1e-3 ? 5 / 60 : time;
    setBreak(normalizedTime + getBreak(false));
    setEnd(normalizedTime + getEnd());
    calculateTotal();
  }
  function reset_break() {
    timer.stop();
    timer.reset();
    clearInterval(refreshIntervalId);
    break_counter_started = false;
    const breakCounterBtn = document.getElementById("break_counter_btn");
    if (breakCounterBtn) {
      breakCounterBtn.innerHTML = "<i class='fal fa-stopwatch'></i> Start";
      breakCounterBtn.classList.remove("btn-warning", "pulsate");
      breakCounterBtn.classList.add("btn-primary");
    }
    setEnd(getEnd() - getBreak(false));
    setBreak(0);
    calculateTotal();
  }
  function break_counter() {
    const breakCounterBtn = document.getElementById("break_counter_btn");
    localStorage.removeItem("break_counter_start_time");
    localStorage.removeItem("break_counter_started");
    if (break_counter_started) {
      break_counter_started = false;
      timer.stop();
      clearInterval(refreshIntervalId);
      const timeInSeconds = Math.round(timer.getTime() / 1e3);
      if (typeof dayjs !== "undefined") {
        const time = dayjs(dayjs.utc(timeInSeconds * 1e3), "HH:mm:ss");
        const timeInDecimalHours = dayjs.duration(time.diff(time.startOf("day")), "milliseconds").asHours();
        setBreak(timeInDecimalHours);
        add_time(getHourSchedule());
      }
      if (breakCounterBtn) {
        breakCounterBtn.innerHTML = "<i class='fal fa-stopwatch'></i> Resume";
        breakCounterBtn.classList.remove("btn-warning", "pulsate");
        breakCounterBtn.classList.add("btn-primary");
      }
    } else {
      break_counter_started = true;
      timer.start();
      refreshIntervalId = setInterval(() => {
        const timeInSeconds = Math.round(timer.getTime() / 1e3);
        if (typeof dayjs !== "undefined") {
          const time = dayjs(dayjs.utc(timeInSeconds * 1e3), "HH:mm:ss");
          const timeInDecimalHours = dayjs.duration(time.diff(time.startOf("day")), "milliseconds").asHours();
          setBreak(timeInDecimalHours);
          add_time(getHourSchedule());
        }
      }, 1e3);
      if (breakCounterBtn) {
        breakCounterBtn.innerHTML = "<i class='fal fa-stopwatch fa-spin'></i> Stop";
        breakCounterBtn.classList.remove("btn-primary");
        breakCounterBtn.classList.add("btn-warning", "pulsate");
      }
    }
  }
  function reset() {
    setEnd(0);
    setTotal(0);
    setTotalDec(0);
    setTotalNoBreak(0);
    setTotalNoBreakDec(0);
    setHistory(true);
    const timeinfo = JSON.parse(localStorage.getItem(todayDate()));
    if (timeinfo === null) {
      setStart(now());
      add_time(getHourSchedule());
    } else {
      setStart(timeinfo.StartDec);
      setBreak(timeinfo.TotalDec - timeinfo.TotalNoBreakDec);
      setEnd(parseFloat(timeinfo.StartDec) + parseFloat(timeinfo.TotalDec));
      setSummary(timeinfo.Summary);
      calculateTotal();
    }
  }
  function loadApp() {
    setEnd(0);
    setTotal(0);
    setTotalDec(0);
    setTotalNoBreak(0);
    setTotalNoBreakDec(0);
    setHistory(true);
    notificationClosed("onload");
    setParameters();
    cleanLocalStorage();
    autoBackup();
    if (localStorage.length < 10 && typeof startIntroduction === "function") {
      startIntroduction();
    }
  }
  function setParameters() {
    const autoend = localStorage.getItem("autoend"), autoend_today_disabled = localStorage.getItem("autoend_today_disabled"), nosave = localStorage.getItem("nosave"), hourschedule = localStorage.getItem("hourschedule"), customhourschedule_value = localStorage.getItem("customhourschedule_value"), break_time_default = localStorage.getItem("break_time_default"), startminsubtract = localStorage.getItem("startminsubtract"), startminsubtract_value = localStorage.getItem("startminsubtract_value"), historydeleteoption = localStorage.getItem("historydeleteoption"), historyretain = localStorage.getItem("historyretain"), historyresetday = localStorage.getItem("historyresetday"), historyresetperiod = localStorage.getItem("historyresetperiod"), historyresetperiodunit = localStorage.getItem("historyresetperiodunit"), autobackupoption = localStorage.getItem("autobackupoption"), autobackupday = localStorage.getItem("autobackupday"), autobackupperiod = localStorage.getItem("autobackupperiod"), autobackupperiodunit = localStorage.getItem("autobackupperiodunit"), overtimeoption = localStorage.getItem("overtimeoption"), totalhoursoption = localStorage.getItem("totalhoursoption"), summaryoption = localStorage.getItem("summaryoption"), historyoption = localStorage.getItem("historyoption"), weeklyovertimeoption = localStorage.getItem("weeklyovertimeoption"), totalovertimeoption = localStorage.getItem("totalovertimeoption"), parametersoption = localStorage.getItem("parametersoption"), breaktime_timeselection_option_timerange = localStorage.getItem("breaktime_timeselection_option_timerange"), theme = localStorage.getItem("theme");
    if (autoend === "true" && document.getElementById("autoend"))
      document.getElementById("autoend").click();
    if (autoend_today_disabled === todayDate() && document.getElementById("autoend_today_disabled"))
      document.getElementById("autoend_today_disabled").click();
    if (nosave === todayDate() && document.getElementById("nosave"))
      document.getElementById("nosave").click();
    setCustomHourScheduleUI(customhourschedule_value);
    setHourSchedule(hourschedule);
    if (break_time_default) {
      const btd = document.getElementById("break_time_default");
      if (btd) btd.value = break_time_default;
      setBreak(break_time_default);
    } else {
      const btd = document.getElementById("break_time_default");
      if (btd) btd.value = 0;
    }
    if (historydeleteoption === "days" && document.getElementById("historydeleteoptiondays")) {
      document.getElementById("historydeleteoptiondays").click();
    } else if (historydeleteoption === "period" && document.getElementById("historydeleteoptionperiod")) {
      document.getElementById("historydeleteoptionperiod").click();
    }
    if (historyretain && document.getElementById("historyretain"))
      document.getElementById("historyretain").value = historyretain;
    if (historyresetday && document.getElementById("historyresetday"))
      document.getElementById("historyresetday").value = historyresetday;
    if (historyresetperiod && document.getElementById("historyresetperiod"))
      document.getElementById("historyresetperiod").value = historyresetperiod;
    if (historyresetperiodunit && document.getElementById("historyresetperiodunit"))
      document.getElementById("historyresetperiodunit").value = historyresetperiodunit;
    showHistorydeleteoptionContent();
    if (autobackupoption === "true" && document.getElementById("autobackupoption"))
      document.getElementById("autobackupoption").click();
    if (autobackupday && document.getElementById("autobackupday"))
      document.getElementById("autobackupday").value = autobackupday;
    if (autobackupperiod && document.getElementById("autobackupperiod"))
      document.getElementById("autobackupperiod").value = autobackupperiod;
    if (autobackupperiodunit && document.getElementById("autobackupperiodunit"))
      document.getElementById("autobackupperiodunit").value = autobackupperiodunit;
    maxValuesCustomTimeOption(
      "autobackup",
      getAutobackupPeriodUnit(),
      calculateExecutionDay(getAutobackupDay(), getAutobackupPeriod(), getAutobackupPeriodUnit()),
      document.getElementById("autobackupperiod"),
      document.getElementById("autobackupday")
    );
    if (overtimeoption === "true" && totalhoursoption === "true" && weeklyovertimeoption === "true" && totalovertimeoption === "true" && summaryoption === "true" && historyoption === "true" && parametersoption === "true") {
      const allOpt = document.getElementById("alloption");
      if (allOpt) allOpt.click();
    } else {
      if ((overtimeoption === "true" || overtimeoption === null) && document.getElementById("overtimeoption"))
        document.getElementById("overtimeoption").click();
      if ((totalhoursoption === "true" || totalhoursoption === null) && document.getElementById("totalhoursoption"))
        document.getElementById("totalhoursoption").click();
      if ((weeklyovertimeoption === "true" || weeklyovertimeoption === null) && document.getElementById("weeklyovertimeoption"))
        document.getElementById("weeklyovertimeoption").click();
      if ((totalovertimeoption === "true" || totalovertimeoption === null) && document.getElementById("totalovertimeoption"))
        document.getElementById("totalovertimeoption").click();
      if ((summaryoption === "true" || summaryoption === null) && document.getElementById("summaryoption"))
        document.getElementById("summaryoption").click();
      if ((historyoption === "true" || historyoption === null) && document.getElementById("historyoption"))
        document.getElementById("historyoption").click();
      if ((parametersoption === "true" || parametersoption === null) && document.getElementById("parametersoption"))
        document.getElementById("parametersoption").click();
    }
    if (breaktime_timeselection_option_timerange === "true") {
      const brkTr = document.getElementById("breaktime_timeselection_option_timerange");
      if (brkTr) brkTr.click();
      breaktimeTimeselection();
    }
    setTheme(theme ? theme : "auto");
    const appearanceRadio = document.getElementById("appearance_" + (theme ? theme : "auto"));
    if (appearanceRadio) appearanceRadio.checked = true;
    if (!startminsubtract_value) {
      set_startminsubtract("5");
    } else {
      set_startminsubtract(startminsubtract_value);
    }
    const timeinfo = JSON.parse(localStorage.getItem(todayDate()));
    if (timeinfo === null) {
      if (startminsubtract === "true") {
        const startminSub = document.getElementById("startminsubtract");
        if (startminSub) startminSub.click();
        let startminsubtract_value_decimal = 0;
        if (typeof dayjs !== "undefined") {
          startminsubtract_value_decimal = dayjs.duration({ minutes: startminsubtract_value || 5 }).asHours();
        }
        setStart(now() - startminsubtract_value_decimal);
      } else {
        setStart(now());
      }
      add_time(getHourSchedule());
    } else {
      setStart(timeinfo.StartDec);
      setBreak(timeinfo.TotalDec - timeinfo.TotalNoBreakDec);
      setEnd(parseFloat(timeinfo.StartDec) + parseFloat(timeinfo.TotalDec));
      setSummary(timeinfo.Summary);
      calculateTotal();
      if (startminsubtract === "true") {
        const startminSub = document.getElementById("startminsubtract");
        if (startminSub) startminSub.click();
      }
    }
  }
  function handleBeforeUnload() {
    const nosave = document.getElementById("nosave");
    const autoend = document.getElementById("autoend");
    const autoend_session_disabled = document.getElementById("autoend_session_disabled");
    const autoend_today_disabled = document.getElementById("autoend_today_disabled");
    if (nosave && !nosave.checked) {
      if (autoend && !autoend.checked) {
        localStorage.setItem("autoend", "false");
        localStorage.setItem("autoend_today_disabled", "false");
      } else if (autoend) {
        if (autoend_today_disabled && autoend_today_disabled.checked || autoend_session_disabled && autoend_session_disabled.checked) {
          if (autoend_today_disabled && autoend_today_disabled.checked) {
            localStorage.setItem("autoend_today_disabled", todayDate());
          }
        } else {
          setEnd(now());
          localStorage.setItem("autoend_today_disabled", "false");
        }
        localStorage.setItem("autoend", "true");
      }
      const timeinfo = {
        TotalNoBreakDec: getTotalNoBreakDec(),
        OvertimeDec: getOvertimeDec(),
        TotalDec: getTotalDec(),
        StartDec: getStart().toString(),
        HourSchedule: getHourSchedule().toFixed(2),
        Summary: getSummary()
      };
      localStorage.setItem(todayDate(), JSON.stringify(timeinfo));
      localStorage.setItem("nosave", "false");
    } else if (autoend) {
      localStorage.setItem("autoend", autoend.checked.toString());
      localStorage.setItem("nosave", todayDate());
    }
    const startMinSub = document.getElementById("startminsubtract");
    if (startMinSub) localStorage.setItem("startminsubtract", startMinSub.checked.toString());
    localStorage.setItem("break_time_default", getBreakDefault());
    localStorage.setItem("break_counter_started", "false");
    localStorage.setItem("historydeleteoption", getHistoryDeleteOption());
    localStorage.setItem("historyretain", getHistoryRetain());
    const optIds = [
      "overtimeoption",
      "totalhoursoption",
      "weeklyovertimeoption",
      "totalovertimeoption",
      "summaryoption",
      "historyoption",
      "autobackupoption",
      "parametersoption",
      "breaktime_timeselection_option_timerange"
    ];
    optIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) localStorage.setItem(id, el.checked.toString());
    });
  }
  function initUIEventListeners() {
    document.querySelectorAll("input").forEach((input) => {
      input.addEventListener("focusout", () => {
        checkInputValues();
      });
    });
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mouseup", function() {
        this.blur();
      });
    });
    const appAlert = document.getElementById("app_alert");
    if (appAlert) {
      appAlert.addEventListener("close.bs.alert", function(event) {
        event.preventDefault();
        this.style.display = "none";
      });
    }
    const hourScheduleSelect = document.getElementById("hourschedule");
    if (hourScheduleSelect) {
      hourScheduleSelect.addEventListener("change", function() {
        activateConfirmationModal("Do you want to set the hour schedule for every day?<br>If not, the selected value will only be applicable today.", (choice) => {
          if (choice === "yes") {
            localStorage.setItem("hourschedule", getHourSchedule());
          }
        });
      });
    }
    const yearSpan = document.getElementById("year_span");
    if (yearSpan && typeof dayjs !== "undefined") {
      yearSpan.innerHTML = dayjs().year();
    }
    if (typeof bootstrap !== "undefined") {
      const hashModals = [
        { hash: "#about", id: "modalabout" },
        { hash: "#settings", id: "modalsettings" },
        { hash: "#info", id: "modalinfo" },
        { hash: "#history", id: "modaledithistory" },
        { hash: "#reporting", id: "modalreporting" },
        { hash: "#policy", id: "modalpolicy" }
      ];
      hashModals.forEach(({ hash, id }) => {
        if (window.location.href.indexOf(hash) !== -1) {
          const elem = document.getElementById(id);
          if (elem) {
            const modal = new bootstrap.Modal(elem);
            modal.show();
          }
        }
      });
    }
  }

  // js/export.js
  function exportHistory() {
    const myArray = JSON.stringify(localStorage, null, 4);
    const vLink = document.getElementById("exportHistoryLink");
    if (!vLink) return;
    const vBlob = new Blob([myArray], { type: "application/json" });
    const vName = "working_history_" + todayDate() + ".json";
    const vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute("href", vUrl);
    vLink.setAttribute("download", vName);
    vLink.click();
  }
  function formatCSV(items) {
    if (!items || items.length === 0) return "";
    const replacer = (key, value) => value === null ? "" : value;
    const header = Object.keys(items[0]);
    return [
      header.join(","),
      ...items.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(","))
    ].join("\r\n");
  }
  function processImportPayload(content, targetStorage = typeof localStorage !== "undefined" ? localStorage : null) {
    if (!content || typeof content !== "object") {
      throw new Error("Invalid import payload: expected an object");
    }
    if (!targetStorage) {
      throw new Error("No storage target available");
    }
    let count = 0;
    Object.keys(content).forEach(function(k) {
      const value = content[k];
      try {
        JSON.parse(value);
        targetStorage.setItem(k, value);
      } catch (innerError) {
        targetStorage.setItem(k, typeof value === "object" ? JSON.stringify(value) : String(value));
      }
      count++;
    });
    return count;
  }
  function exportCSV() {
    const keys = getHistoryKeys();
    const items = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      try {
        let timeinfo = JSON.parse(localStorage.getItem(key));
        if (timeinfo && Object.prototype.hasOwnProperty.call(timeinfo, "OvertimeDec")) {
          timeinfo = Object.assign({ Date: key }, timeinfo);
          items.push(timeinfo);
        }
      } catch (e) {
        console.error("Error parsing history key for CSV:", key, e);
      }
    }
    if (items.length === 0) {
      alert("No data available to export.");
      return;
    }
    const csv = formatCSV(items);
    const vLink = document.getElementById("exportCSVLink");
    if (!vLink) return;
    const vName = "working_history_" + todayDate() + ".csv";
    const vUrl = "data:text/csv;charset=utf-8," + encodeURI(csv);
    vLink.setAttribute("href", vUrl);
    vLink.setAttribute("download", vName);
    vLink.click();
  }
  function setExportRange(type) {
    if (typeof dayjs === "undefined") return;
    const startInput = document.getElementById("export_start_date");
    const endInput = document.getElementById("export_end_date");
    if (!startInput || !endInput) return;
    if (type === "thisMonth") {
      startInput.value = dayjs().startOf("month").format("YYYY-MM-DD");
      endInput.value = dayjs().endOf("month").format("YYYY-MM-DD");
    } else if (type === "lastMonth") {
      startInput.value = dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
      endInput.value = dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
    } else if (type === "allTime") {
      const keys = getHistoryKeys();
      if (keys.length > 0) {
        startInput.value = dayjs(keys[0], "DD-MM-YYYY").format("YYYY-MM-DD");
      } else {
        startInput.value = dayjs().format("YYYY-MM-DD");
      }
      endInput.value = dayjs().format("YYYY-MM-DD");
    }
  }
  function exportPDF() {
    if (typeof window.jspdf === "undefined" || typeof dayjs === "undefined") {
      console.error("jsPDF or dayjs is not loaded.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const startVal = document.getElementById("export_start_date") ? document.getElementById("export_start_date").value : "";
    const endVal = document.getElementById("export_end_date") ? document.getElementById("export_end_date").value : "";
    const startDate = startVal ? dayjs(startVal) : dayjs("1900-01-01");
    const endDate = endVal ? dayjs(endVal) : dayjs("2100-01-01");
    const keys = getHistoryKeys();
    const tableData = [];
    let totalHours = 0;
    let totalOvertime = 0;
    keys.forEach((key) => {
      if (testDateFormat(key)) {
        const currentObj = dayjs(key, "DD-MM-YYYY");
        if (currentObj.isBetween(startDate, endDate, "day", "[]")) {
          try {
            const timeinfo = JSON.parse(localStorage.getItem(key));
            if (timeinfo) {
              const date = key;
              const start = timeinfo.StartDec !== "correction" ? parseFloat(timeinfo.StartDec).toFixed(2) : "-";
              let end = "-";
              if (timeinfo.StartDec !== "correction" && timeinfo.TotalDec !== "correction") {
                end = (parseFloat(timeinfo.StartDec) + parseFloat(timeinfo.TotalDec)).toFixed(2);
                if (parseFloat(end) >= 24) end = (parseFloat(end) - 24).toFixed(2);
              }
              const total = timeinfo.TotalDec !== "correction" ? parseFloat(timeinfo.TotalDec).toFixed(2) : "0.00";
              const overtime = timeinfo.OvertimeDec;
              const summary = timeinfo.Summary ? timeinfo.Summary.replace(/\n/g, " ") : "";
              tableData.push([date, start, end, total, overtime, summary]);
              if (!isNaN(parseFloat(total))) totalHours += parseFloat(total);
              if (!isNaN(parseFloat(overtime))) totalOvertime += parseFloat(overtime);
            }
          } catch (e) {
            console.error("Error reading entry for PDF:", key, e);
          }
        }
      }
    });
    doc.setFontSize(18);
    doc.text("Working Hours Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Period: ${startDate.format("DD/MM/YYYY")} - ${endDate.format("DD/MM/YYYY")}`, 14, 30);
    doc.text(`Total Days Recorded: ${tableData.length}`, 14, 36);
    doc.text(`Total Hours Recorded: ${totalHours.toFixed(2)}h`, 14, 42);
    doc.text(`Total Overtime Recorded: ${totalOvertime.toFixed(2)}h`, 14, 48);
    if (typeof doc.autoTable === "function") {
      doc.autoTable({
        head: [["Date", "Start", "End", "Total", "Overtime", "Summary"]],
        body: tableData,
        startY: 57,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: {
          0: { cellWidth: 25 },
          5: { cellWidth: "auto" }
        }
      });
    }
    doc.save(`working_hours_${startDate.format("YYYYMMDD")}_to_${endDate.format("YYYYMMDD")}.pdf`);
    const modalEl = document.getElementById("modalexport");
    if (modalEl && typeof bootstrap !== "undefined") {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    }
  }
  function importHistoryData(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const importFile = document.getElementById("importFile");
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      try {
        const content = JSON.parse(readerEvent.target.result);
        processImportPayload(content, localStorage);
        if (importFile) importFile.value = "";
        if (typeof window !== "undefined") {
          if (typeof window.setHistory === "function") window.setHistory(true);
          if (typeof window.setParameters === "function") window.setParameters();
        }
        const closeBtn = document.getElementById("settingsmodalclosebutton");
        if (closeBtn) closeBtn.click();
        alert("Import successful!");
      } catch (error) {
        alert("Import failed! The file contains invalid JSON data.");
        console.error("Error parsing imported file:", error);
      }
    };
    reader.readAsText(files[0]);
  }
  function initImportExport() {
    const importHistoryBtn = document.getElementById("importHistory");
    const importFile = document.getElementById("importFile");
    if (importFile) {
      importFile.addEventListener("change", importHistoryData, false);
    }
    if (importHistoryBtn && importFile) {
      importHistoryBtn.onclick = function() {
        importFile.click();
      };
    }
  }

  // js/main.js
  console.log("loaded javascript.js (ES6 modular)");
  if (typeof window !== "undefined") {
    window.floatToTimeString = floatToTimeString;
    window.timeStringToFloat = timeStringToFloat;
    window.reverseDateRepresentation = reverseDateRepresentation;
    window.testDateFormat = testDateFormat;
    window.now = now;
    window.todayDate = todayDate;
    window.calculateWorktime = calculateWorktime;
    window.calculateOvertime = calculateOvertime;
    window.calculateTotalNoBreak = calculateTotalNoBreak;
    window.calculateExecutionDay = calculateExecutionDay;
    window.escapeHtml = escapeHtml;
    window.Timer = Timer;
    window.getHistoryKeys = getHistoryKeys;
    window.getHistoryDeleteOption = getHistoryDeleteOption;
    window.getHistoryRetain = getHistoryRetain;
    window.getHistoryResetDay = getHistoryResetDay;
    window.getHistoryResetPeriod = getHistoryResetPeriod;
    window.getHistoryResetPeriodUnit = getHistoryResetPeriodUnit;
    window.getAutobackupDay = getAutobackupDay;
    window.getAutobackupPeriod = getAutobackupPeriod;
    window.getAutobackupPeriodUnit = getAutobackupPeriodUnit;
    window.getDayRecord = getDayRecord;
    window.saveDayRecord = saveDayRecord;
    window.cleanLocalStorage = cleanLocalStorage;
    window.autoBackup = autoBackup;
    window.deleteHistory = deleteHistory;
    window.saveCleaningDay = saveCleaningDay;
    window.saveBackupDay = saveBackupDay;
    window.importBootstrapColors = importBootstrapColors;
    window.colorScheme = colorScheme;
    window.timer = timer;
    window.getStart = getStart;
    window.setStart = setStart;
    window.getEnd = getEnd;
    window.setEnd = setEnd;
    window.getBreak = getBreak;
    window.getBreakTimeStart = getBreakTimeStart;
    window.setBreak = setBreak;
    window.getBreakDefault = getBreakDefault;
    window.setBreakDefault = setBreakDefault;
    window.addBreakDefault = addBreakDefault;
    window.getHourSchedule = getHourSchedule;
    window.setHourSchedule = setHourSchedule;
    window.setCustomHourSchedule = setCustomHourSchedule;
    window.setCustomHourScheduleUI = setCustomHourScheduleUI;
    window.getWorktime = getWorktime;
    window.calculateTotal = calculateTotal;
    window.setTotal = setTotal;
    window.getTotalDec = getTotalDec;
    window.setTotalDec = setTotalDec;
    window.setOvertime = setOvertime;
    window.getOvertimeDec = getOvertimeDec;
    window.setOvertimeDec = setOvertimeDec;
    window.setOvertimeTotal = setOvertimeTotal;
    window.setOvertimeWeekly = setOvertimeWeekly;
    window.setTotalNoBreak = setTotalNoBreak;
    window.getTotalNoBreakDec = getTotalNoBreakDec;
    window.setTotalNoBreakDec = setTotalNoBreakDec;
    window.getSummary = getSummary;
    window.setSummary = setSummary;
    window.setResetDate = setResetDate;
    window.getResetDate = getResetDate;
    window.setBackupDate = setBackupDate;
    window.getBackupDate = getBackupDate;
    window.showHistorydeleteoptionContent = showHistorydeleteoptionContent;
    window.maxValuesCustomTimeOption = maxValuesCustomTimeOption;
    window.setHistory = setHistory;
    window.notificationClosed = notificationClosed;
    window.set_startminsubtract = set_startminsubtract;
    window.hourscheduleAddTimeButton = hourscheduleAddTimeButton;
    window.breaktimeTimeselection = breaktimeTimeselection;
    window.checkInputValues = checkInputValues;
    window.setAlertMessage = setAlertMessage;
    window.allCheckBox = allCheckBox;
    window.activateConfirmationModal = activateConfirmationModal;
    window.setTheme = setTheme;
    window.end_time = end_time;
    window.add_time = add_time;
    window.applyWeeklyOvertime = applyWeeklyOvertime;
    window.add_break = add_break;
    window.reset_break = reset_break;
    window.break_counter = break_counter;
    window.reset = reset;
    window.loadApp = loadApp;
    window.setParameters = setParameters;
    window.exportHistory = exportHistory;
    window.exportCSV = exportCSV;
    window.formatCSV = formatCSV;
    window.processImportPayload = processImportPayload;
    window.setExportRange = setExportRange;
    window.exportPDF = exportPDF;
    window.importHistoryData = importHistoryData;
  }
  function initializeApp() {
    if (typeof dayjs !== "undefined") {
      dayjs().format();
      if (window.dayjs_plugin_duration) dayjs.extend(window.dayjs_plugin_duration);
      if (window.dayjs_plugin_isSameOrBefore) dayjs.extend(window.dayjs_plugin_isSameOrBefore);
      if (window.dayjs_plugin_isSameOrAfter) dayjs.extend(window.dayjs_plugin_isSameOrAfter);
      if (window.dayjs_plugin_customParseFormat) dayjs.extend(window.dayjs_plugin_customParseFormat);
      if (window.dayjs_plugin_utc) dayjs.extend(window.dayjs_plugin_utc);
      if (window.dayjs_plugin_isBetween) dayjs.extend(window.dayjs_plugin_isBetween);
    }
    importBootstrapColors();
    loadApp();
    initImportExport();
    initUIEventListeners();
    if (typeof bootstrap !== "undefined") {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
          boundary: document.body,
          delay: { show: 1e3, hide: 0 }
        });
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }
  window.addEventListener("load", function() {
    if (localStorage.length < 10 && typeof window.startIntroduction === "function" && !document.getElementById("introductioncontainer")) {
      window.startIntroduction();
    }
    if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("service-worker.js", { scope: "/" }).then(function(registration) {
        console.log("Service worker registered successfully:", registration);
      }).catch(function(e) {
        console.error("Error during service worker registration:", e);
      });
    }
  });
  window.onbeforeunload = function() {
    handleBeforeUnload();
  };
  document.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
      add_time(getHourSchedule());
    }
  });
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      const appearance = document.querySelector('input[name="appearance"]:checked');
      if (appearance && appearance.value === "auto") {
        setTheme("auto");
      }
    });
  }
})();
