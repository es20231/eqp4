import moment from "moment";

export default (UTCStringDate: string) => {
  if (UTCStringDate == "" || UTCStringDate == undefined) {
    return "tesada-";
  }

  let friendlyDateString = "";
  const argDate = moment(UTCStringDate);
  const today = moment();
  const dateAndTodayDiferrence = today.diff(argDate, "hours");
  const dateAndTodayMinDiferrence = today.diff(argDate, "minutes");
  const argDateString = argDate.format("DD/MM/YYYY");

  console.log(dateAndTodayDiferrence);
  switch (true) {
    case dateAndTodayDiferrence == 0 && dateAndTodayMinDiferrence > 1:
      friendlyDateString = `${dateAndTodayMinDiferrence} min`;
      break;
    case dateAndTodayDiferrence == 0:
      friendlyDateString = "agora";
      break;
    case dateAndTodayDiferrence == 1:
      friendlyDateString = `${dateAndTodayDiferrence} hora atrás`;
      break;
    case dateAndTodayDiferrence > 1 && dateAndTodayDiferrence <= 23:
      friendlyDateString = `${dateAndTodayDiferrence} horas atrás`;
      break;
    case dateAndTodayDiferrence >= 24 && dateAndTodayDiferrence <= 48:
      friendlyDateString = "ontem";
      break;
    case dateAndTodayDiferrence > 48:
      friendlyDateString = argDateString;
      break;
    default:
      friendlyDateString = "Error";
      break;
  }
  return friendlyDateString;
};
