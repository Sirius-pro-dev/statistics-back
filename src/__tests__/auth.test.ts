import jwt from 'jsonwebtoken'
import {authMiddleware} from '../middleware/authMiddleware'

describe('Auth Middleware', () => {
    it('Should pass if token and role are valid', () => {
        const mockRequest = {
            method: 'GET',
            headers: {
                authorization: 'Bearer validToken'
            }
        };
        const mockResponse: any = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        const mockNext = jest.fn();

        jwt.verify = jest.fn(() => ({ role: 'Преподаватель' }));

        authMiddleware(mockRequest, mockResponse, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('Should return 403 if token is missing', () => {
        const mockRequest = {
            method: 'GET',
            headers: { 
                authorization: ''
            }
        };
        const mockResponse: any = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        const mockNext = jest.fn();
    
        authMiddleware(mockRequest, mockResponse, mockNext);
    
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Пользователь не авторизован', success: false });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should return 403 if user role is not "Преподаватель"', () => {
        const mockRequest = {
            method: 'GET',
            headers: {
                authorization: 'Bearer validToken'
            }
        };
        const mockResponse: any = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        const mockNext = jest.fn();

        jwt.verify = jest.fn(() => ({ role: 'Student' }));

        authMiddleware(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Нет доступа', success: false });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('Should return 403 if token verification fails', () => {
        const mockRequest = {
            method: 'GET',
            headers: {
                authorization: 'Bearer invalidToken'
            }
        };
        const mockResponse: any = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        const mockNext = jest.fn();

        jwt.verify = jest.fn(() => {
            throw new Error('Invalid token');
        });

        authMiddleware(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Пользователь не авторизован', success: false });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
