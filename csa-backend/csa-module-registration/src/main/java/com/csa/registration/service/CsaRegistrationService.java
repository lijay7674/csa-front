package com.csa.registration.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.registration.entity.CsaRegistration;

import java.io.OutputStream;
import java.util.List;

public interface CsaRegistrationService {

    CsaRegistration submit(CsaRegistration reg);

    List<CsaRegistration> query(String phone, String studentId, String regNo);

    IPage<CsaRegistration> listPage(int page, int size, String targetType, Long targetId,
                                     String status, String keyword, String regType);

    CsaRegistration getById(Long id);

    void updateStatus(Long id, String status, String comment, Long reviewedBy);

    void addContactRecord(Long id, String contactRecordEntry);

    void export(OutputStream outputStream, String targetType, String status);
}
