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
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        response.success && ProfileWidget.showProfile(response.data);
        let message = '';
        moneyManager.setMessage(response.success, message = response.success ? 'Пополнение прошло успешно!': response.error);
    });
};

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        response.success && ProfileWidget.showProfile(response.data);
        let message = '';
        moneyManager.setMessage(response.success, message = response.success ? 'Конвертация прошла успешно!': response.error);
    });
};

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        response.success && ProfileWidget.showProfile(response.data);
        let message = '';
        moneyManager.setMessage(response.success, message = response.success ? 'Перевод прошел успешно!': response.error);
    });
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    response.success && favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
});

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Добавление прошло успешно!');
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Удаление прошло успешно!');
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
}