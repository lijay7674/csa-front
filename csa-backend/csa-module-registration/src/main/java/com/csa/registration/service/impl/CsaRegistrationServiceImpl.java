package com.csa.registration.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.csa.common.enums.RegistrationStatus;
import com.csa.registration.entity.CsaRegistration;
import com.csa.registration.mapper.CsaRegistrationMapper;
import com.csa.registration.service.CsaRegistrationService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class CsaRegistrationServiceImpl implements CsaRegistrationService {

    private final CsaRegistrationMapper csaRegistrationMapper;
    private final ObjectMapper objectMapper;

    @Override
    public CsaRegistration submit(CsaRegistration reg) {
        checkDuplicate(reg);

        reg.setRegNo(generateRegNo());
        reg.setSubmitTime(LocalDateTime.now());
        reg.setStatus(RegistrationStatus.PENDING.name());

        csaRegistrationMapper.insert(reg);
        return reg;
    }

    @Override
    public List<CsaRegistration> query(String phone, String studentId, String regNo) {
        LambdaQueryWrapper<CsaRegistration> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(regNo != null && !regNo.isBlank(), CsaRegistration::getRegNo, regNo);
        if (regNo == null || regNo.isBlank()) {
            wrapper.and(w -> {
                if (phone != null && !phone.isBlank()) {
                    w.or().eq(CsaRegistration::getPhone, phone);
                }
                if (studentId != null && !studentId.isBlank()) {
                    w.or().eq(CsaRegistration::getStudentId, studentId);
                }
            });
        }
        wrapper.orderByDesc(CsaRegistration::getSubmitTime);
        return csaRegistrationMapper.selectList(wrapper);
    }

    @Override
    public IPage<CsaRegistration> listPage(int page, int size, String targetType, Long targetId,
                                            String status, String keyword, String regType) {
        Page<CsaRegistration> pageParam = new Page<>(page, size);
        return csaRegistrationMapper.selectPageWithFilter(pageParam, targetType, targetId, status, keyword, regType);
    }

    @Override
    public CsaRegistration getById(Long id) {
        return csaRegistrationMapper.selectById(id);
    }

    @Override
    public void updateStatus(Long id, String status, String comment, Long reviewedBy) {
        CsaRegistration reg = new CsaRegistration();
        reg.setId(id);
        reg.setStatus(status);
        reg.setReviewComment(comment);
        reg.setReviewedBy(reviewedBy);
        reg.setReviewedAt(LocalDateTime.now());
        csaRegistrationMapper.updateById(reg);
    }

    @Override
    public void addContactRecord(Long id, String contactRecordEntry) {
        CsaRegistration existing = csaRegistrationMapper.selectById(id);
        if (existing == null) {
            return;
        }

        List<String> records;
        try {
            if (existing.getContactRecord() != null && !existing.getContactRecord().isBlank()) {
                records = objectMapper.readValue(existing.getContactRecord(), new TypeReference<>() {});
            } else {
                records = new ArrayList<>();
            }
        } catch (Exception e) {
            records = new ArrayList<>();
        }

        records.add(contactRecordEntry);

        try {
            String updatedJson = objectMapper.writeValueAsString(records);
            CsaRegistration reg = new CsaRegistration();
            reg.setId(id);
            reg.setContactRecord(updatedJson);
            csaRegistrationMapper.updateById(reg);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update contact record", e);
        }
    }

    @Override
    public void export(OutputStream outputStream, String targetType, String status) {
        // TODO: Implement Excel export
        throw new UnsupportedOperationException("Excel export not yet implemented");
    }

    private String generateRegNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
        return "REG" + timestamp + random;
    }

    private void checkDuplicate(CsaRegistration reg) {
        LambdaQueryWrapper<CsaRegistration> wrapper = new LambdaQueryWrapper<>();

        if ("competition".equals(reg.getRegType())) {
            wrapper.eq(CsaRegistration::getStudentId, reg.getStudentId())
                   .eq(CsaRegistration::getTargetId, reg.getTargetId())
                   .eq(CsaRegistration::getStatus, RegistrationStatus.PENDING.name());
        } else if ("event".equals(reg.getRegType())) {
            wrapper.eq(CsaRegistration::getPhone, reg.getPhone())
                   .eq(CsaRegistration::getTargetId, reg.getTargetId())
                   .eq(CsaRegistration::getStatus, RegistrationStatus.PENDING.name());
        } else if ("recruitment".equals(reg.getRegType())) {
            wrapper.eq(CsaRegistration::getStudentId, reg.getStudentId())
                   .eq(CsaRegistration::getTargetType, reg.getTargetType())
                   .eq(CsaRegistration::getStatus, RegistrationStatus.PENDING.name());
        }

        Long count = csaRegistrationMapper.selectCount(wrapper);
        if (count != null && count > 0) {
            throw new RuntimeException("您已提交过相同的报名申请，请勿重复提�?);
        }
    }
}
