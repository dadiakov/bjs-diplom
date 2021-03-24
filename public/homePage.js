'use strict';

const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout(response => {
    response.success && location.reload();
  });
};

ApiConnector.current( response => {
    response.success && ProfileWidget.showProfile(response.data);
});

const ratesBoard = new RatesBoard();
function getCurrentVault() {
    ApiConnector.getStocks(response => {
        response.success && ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    });
};
getCurrentVault();
setInterval(getCurrentVault, 60000);

const moneyManager = new MoneyManager();

function moneyManagerSub(response, successMessage) {
    response.success && ProfileWidget.showProfile(response.data);
    let message = '';
    moneyManager.setMessage(response.success, message = response.success ? successMessage : response.error);
};

moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        moneyManagerSub(response, 'Пополнение прошло успешно!');
    });
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        moneyManagerSub(response, 'Конвертация прошла успешно!');
    });
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        moneyManagerSub(response, 'Перевод прошел успешно!');
    });
};

const favoritesWidget = new FavoritesWidget();

function favoritesWidgetSub(response, successMessage) {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, successMessage);
        } else {
          favoritesWidget.setMessage(response.success, response.error);
        }
};

ApiConnector.getFavorites(response => {
    response.success && favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
});

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        favoritesWidgetSub(response, 'Добавление прошло успешно!');
    });
};

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        favoritesWidgetSub(response, 'Удаление прошло успешно!');
    });
};